const express = require('express');
const { supabase, supabaseAdmin } = require('../lib/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

function calculateInvoiceTotals(items, vatEnabled, taxRate) {
  const subtotal = items.reduce((sum, item) => {
    const lineTotal = item.quantity * item.rate;
    const afterDiscount = lineTotal - (lineTotal * (item.discount / 100));
    return sum + afterDiscount;
  }, 0);
  
  const vat = vatEnabled ? subtotal * (taxRate || 0.075) : 0;
  const total = subtotal + vat;
  
  return { subtotal, vat, total };
}

function detectOverdueStatus(invoice) {
  if (invoice.status === 'paid' || invoice.status === 'draft') {
    return invoice.status;
  }
  
  if (!invoice.due_date) {
    return invoice.status;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(invoice.due_date);
  dueDate.setHours(0, 0, 0, 0);
  
  if (dueDate < today) {
    return 'overdue';
  }
  
  return invoice.status;
}

router.get('/', async (req, res) => {
  try {
    const { status, client_id, from_date, to_date } = req.query;

    let query = supabaseAdmin
      .from('invoices')
      .select('*, clients(name, email, phone, address)')
      .eq('user_id', req.user.userId);

    if (status) query = query.eq('status', status);
    if (client_id) query = query.eq('client_id', client_id);
    if (from_date) query = query.gte('due_date', from_date);
    if (to_date) query = query.lte('due_date', to_date);

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const invoicesWithItems = await Promise.all(
      data.map(async (inv) => {
        const { data: items } = await supabaseAdmin
          .from('invoice_items')
          .select('*')
          .eq('invoice_id', inv.id);
        
        let resolvedStatus = inv.status;
        
        if (inv.status === 'sent' && inv.due_date) {
          const dueDate = new Date(inv.due_date);
          dueDate.setHours(0, 0, 0, 0);
          if (dueDate < today) {
            resolvedStatus = 'overdue';
          }
        }
        
        return { ...inv, items, status: resolvedStatus };
      })
    );

    res.json(invoicesWithItems);
  } catch (err) {
    console.error('Get invoices error:', err);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { client_id, issue_date, due_date, items, notes, vat_enabled, tax_rate, invoice_number } = req.body;

    if (!client_id || !items || items.length === 0) {
      return res.status(400).json({ error: 'Client and at least one item are required' });
    }

    if (!invoice_number) {
      const { data: lastInvoice } = await supabaseAdmin
        .from('invoices')
        .select('invoice_number')
        .eq('user_id', req.user.userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      let nextNum = 1;
      if (lastInvoice?.invoice_number) {
        const match = lastInvoice.invoice_number.match(/(\d+)$/);
        if (match) {
          nextNum = parseInt(match[1]) + 1;
        }
      }
      invoiceNumber = `INV-${String(nextNum).padStart(4, '0')}`;
    } else {
      invoiceNumber = invoice_number;
    }

    const { subtotal, vat, total } = calculateInvoiceTotals(items, vat_enabled, tax_rate || 0.075);

    const { data: invoice, error } = await supabaseAdmin
      .from('invoices')
      .insert({
        user_id: req.user.userId,
        client_id,
        invoice_number: invoiceNumber,
        issue_date: issue_date || new Date().toISOString().split('T')[0],
        due_date,
        subtotal,
        vat,
        total,
        vat_enabled: vat_enabled || false,
        status: 'draft',
        notes,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    const itemsWithInvoiceId = items.map(item => ({
      invoice_id: invoice.id,
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      discount: item.discount || 0,
      unit: item.unit || 'pcs'
    }));

    const { error: itemsError } = await supabaseAdmin
      .from('invoice_items')
      .insert(itemsWithInvoiceId);

    if (itemsError) throw itemsError;

    const { data: savedItems } = await supabaseAdmin
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', invoice.id);

    res.status(201).json({ ...invoice, items: savedItems });
  } catch (err) {
    console.error('Create invoice error:', err);
    res.status(500).json({ error: err.message || 'Failed to create invoice' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { client_id, issue_date, due_date, status, notes, vat_enabled, tax_rate, items, invoice_number } = req.body;

    let updateData = { 
      client_id, 
      issue_date, 
      due_date, 
      status, 
      notes, 
      vat_enabled,
      invoice_number
    };
    updateData = Object.fromEntries(Object.entries(updateData).filter(([_, v]) => v !== undefined));

    const { data: invoice, error } = await supabaseAdmin
      .from('invoices')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', req.user.userId)
      .select()
      .single();

    if (error) throw error;

    if (items) {
      await supabaseAdmin.from('invoice_items').delete().eq('invoice_id', id);
      
      const itemsWithInvoiceId = items.map(item => ({
        invoice_id: id,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        discount: item.discount || 0,
        unit: item.unit || 'pcs'
      }));

      await supabaseAdmin.from('invoice_items').insert(itemsWithInvoiceId);

      const { subtotal, vat, total } = calculateInvoiceTotals(items, invoice.vat_enabled, tax_rate || 0.075);

      await supabaseAdmin
        .from('invoices')
        .update({ subtotal, vat, total })
        .eq('id', id);
    }

    const { data: updatedInvoice } = await supabaseAdmin
      .from('invoices')
      .select('*, clients(name, email, phone, address)')
      .eq('id', id)
      .single();

    const { data: savedItems } = await supabaseAdmin
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', id);

    res.json({ ...updatedInvoice, items: savedItems });
  } catch (err) {
    console.error('Update invoice error:', err);
    res.status(500).json({ error: err.message || 'Failed to update invoice' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await supabaseAdmin.from('invoice_items').delete().eq('invoice_id', id);

    const { error } = await supabaseAdmin
      .from('invoices')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.userId);

    if (error) throw error;
    res.json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    console.error('Delete invoice error:', err);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: invoice, error } = await supabaseAdmin
      .from('invoices')
      .select('*, clients(*)')
      .eq('id', id)
      .eq('user_id', req.user.userId)
      .single();

    if (error) throw error;

    const { data: items } = await supabaseAdmin
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', id);

    let resolvedStatus = invoice.status;
    
    if (invoice.status === 'sent' && invoice.due_date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dueDate = new Date(invoice.due_date);
      dueDate.setHours(0, 0, 0, 0);
      if (dueDate < today) {
        resolvedStatus = 'overdue';
      }
    }

    res.json({ ...invoice, items, status: resolvedStatus });
  } catch (err) {
    console.error('Get invoice error:', err);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
});

router.post('/:id/send', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: invoice, error } = await supabaseAdmin
      .from('invoices')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', req.user.userId)
      .select('*, clients(*)')
      .single();

    if (error) throw error;

    const { data: items } = await supabaseAdmin
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', id);

    res.json({ ...invoice, items });
  } catch (err) {
    console.error('Send invoice error:', err);
    res.status(500).json({ error: 'Failed to send invoice' });
  }
});

router.post('/:id/mark-paid', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: invoice, error } = await supabaseAdmin
      .from('invoices')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', req.user.userId)
      .select('*, clients(*)')
      .single();

    if (error) throw error;

    const { data: items } = await supabaseAdmin
      .from('invoice_items')
      .select('*')
      .eq('invoice_id', id);

    res.json({ ...invoice, items });
  } catch (err) {
    console.error('Mark paid error:', err);
    res.status(500).json({ error: 'Failed to mark invoice as paid' });
  }
});

module.exports = router;