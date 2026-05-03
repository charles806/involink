const express = require('express');
const { supabase, supabaseAdmin } = require('../lib/supabase');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = supabaseAdmin
      .from('clients')
      .select('*')
      .eq('user_id', req.user.userId)
      .order('created_at', { ascending: false });

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Get clients error:', err);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Client name is required' });
    }

    const { data, error } = await supabaseAdmin
      .from('clients')
      .insert({
        user_id: req.user.userId,
        name,
        email,
        phone,
        address,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('Create client error:', err);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    const { data, error } = await supabaseAdmin
      .from('clients')
      .update({ name, email, phone, address })
      .eq('id', id)
      .eq('user_id', req.user.userId)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Update client error:', err);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('clients')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.userId);

    if (error) throw error;
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    console.error('Delete client error:', err);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

module.exports = router;