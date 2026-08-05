import { useState, useEffect, useMemo } from "react";
import { GlassCard } from "../components/GlassCard";
import { Plus, Trash2, Calendar, Send, Save, AlertCircle, Check, Calculator } from "lucide-react";
import { toast } from "sonner";
import api from "../lib/api";
import { computeInvoiceTotals, validateLineItems, formatCurrency } from "../lib/invoiceMath";
import { useNavigate, useParams } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  discount: number;
  unit: string;
}

interface ValidationError {
  field: string;
  message: string;
}

export function InvoiceCreation() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [items, setItems] = useState<LineItem[]>([
    { id: "1", description: "", quantity: 1, rate: 0, discount: 0, unit: "pcs" },
  ]);
  const [vatEnabled, setVatEnabled] = useState(false);
  const [taxRate, setTaxRate] = useState(7.5);
  const [client, setClient] = useState("");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(!!id);
  
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [status, setStatus] = useState("draft");
  const [notes, setNotes] = useState("");
  const [selectedClientData, setSelectedClientData] = useState<any>(null);

  const [userProfile, setUserProfile] = useState<any>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    loadInitialData();
  }, [id]);

  const loadInitialData = async () => {
    try {
      const user = api.getUser();
      setUserProfile(user || { name: "Your Company", email: "hello@company.com" });

      const clientsData = await api.getClients();
      setClients(clientsData);

      const settingsRaw = localStorage.getItem("involink_user_settings");
      if (settingsRaw) {
        try {
          const settings = JSON.parse(settingsRaw);
          if (!id) {
            if (settings.taxPercentage > 0) {
              setVatEnabled(true);
              setTaxRate(settings.taxPercentage);
            }
            if (settings.startingInvoiceNumber) {
              setInvoiceNumber(settings.startingInvoiceNumber);
            }
          }
          setUserProfile((prev: any) => ({ ...prev, ...settings }));
        } catch (e) {}
      }

      if (id) {
        setIsInitializing(true);
        const invoiceData = await api.getInvoice(id);
        
        setClient(invoiceData.client_id || "");
        setSelectedClientData(invoiceData.clients);
        if (invoiceData.issue_date) {
            setIssueDate(new Date(invoiceData.issue_date).toISOString().split('T')[0]);
        }
        if (invoiceData.due_date) {
            setDueDate(new Date(invoiceData.due_date).toISOString().split('T')[0]);
        }
        setVatEnabled(invoiceData.vat_enabled || false);
        setInvoiceNumber(invoiceData.invoice_number || "");
        setStatus(invoiceData.status || "draft");
        setNotes(invoiceData.notes || "");
        
        if (invoiceData.vat && invoiceData.subtotal) {
          setTaxRate(invoiceData.vat / invoiceData.subtotal * 100);
        }

        if (invoiceData.items && invoiceData.items.length > 0) {
          setItems(invoiceData.items.map((item: any) => ({
            id: item.id || Math.random().toString(),
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            discount: item.discount || 0,
            unit: item.unit || "pcs"
          })));
        }
      }
    } catch (err: any) {
      toast.error("Failed to load invoice data");
    } finally {
      setIsInitializing(false);
    }
  };

  const { subtotal, vat: calculatedVat, total } = useMemo(() => {
    return computeInvoiceTotals(items, vatEnabled, taxRate);
  }, [items, vatEnabled, taxRate]);

  const validate = (): boolean => {
    const newErrors: ValidationError[] = [];
    
    if (!client) {
      newErrors.push({ field: "client", message: "Please select a client" });
    }
    if (!issueDate) {
      newErrors.push({ field: "issueDate", message: "Issue date is required" });
    }
    if (!dueDate) {
      newErrors.push({ field: "dueDate", message: "Due date is required" });
    }
    if (new Date(dueDate) < new Date(issueDate)) {
      newErrors.push({ field: "dueDate", message: "Due date cannot be before issue date" });
    }
    if (!invoiceNumber.trim()) {
      newErrors.push({ field: "invoiceNumber", message: "Invoice number is required" });
    }
    
    if (validateLineItems(items)) {
      newErrors.push({ field: "items", message: "Please fix all line items" });
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const getFieldError = (field: string): string | undefined => {
    return errors.find(e => e.field === field)?.message;
  };

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), description: "", quantity: 1, rate: 0, discount: 0, unit: "pcs" }]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) {
      toast.error("At least one line item is required");
      return;
    }
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleClientChange = (clientId: string) => {
    setClient(clientId);
    const clientData = clients.find(c => c.id === clientId);
    setSelectedClientData(clientData);
    setErrors(prev => prev.filter(e => e.field !== "client"));
  };

  const constructPayload = () => ({
    client_id: client,
    issue_date: issueDate,
    due_date: dueDate,
    notes: notes,
    vat_enabled: vatEnabled,
    tax_rate: taxRate / 100,
    items: items.map(item => ({
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      discount: item.discount,
      unit: item.unit
    }))
  });

  const handleSave = async (isDraft = true) => {
    if (!validate()) {
      toast.error("Please fix the errors before saving");
      return null;
    }

    setIsLoading(true);
    try {
      let savedInvoice;
      if (id) {
        savedInvoice = await api.updateInvoice(id, constructPayload());
        toast.success(isDraft ? "Draft updated" : "Invoice saved");
      } else {
        savedInvoice = await api.createInvoice(constructPayload());
        toast.success(isDraft ? "Draft created" : "Invoice saved");
        navigate(`/app/invoices/edit/${savedInvoice.id}`, { replace: true });
      }
      setInvoiceNumber(savedInvoice.invoice_number);
      setStatus(savedInvoice.status);
      return savedInvoice;
    } catch (err: any) {
      toast.error(err.message || "Failed to save invoice");
      if (err.message && err.message.includes("Free plan limit reached")) {
        navigate('/pricing');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (status !== "draft" && status !== "sent") {
      toast.error("This invoice has already been sent");
      return;
    }
    
    if (!validate()) {
      toast.error("Please fix the errors before sending");
      return;
    }

    const confirmSend = confirm("Are you sure you want to send this invoice? This action cannot be undone.");
    if (!confirmSend) return;
    
    const saved = await handleSave(false);
    if (!saved) return;
    
    setIsLoading(true);
    try {
      await api.sendInvoice(saved.id || id);
      toast.success(`Invoice sent to ${selectedClientData?.name || "client"}`);
      navigate("/app");
    } catch (err: any) {
      toast.error(err.message || "Failed to send invoice");
    } finally {
      setIsLoading(false);
    }
  };

  const unitOptions = ["pcs", "kg", "hrs", "days", "units", "lots", "boxes"];

  if (isInitializing) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-8rem)] md:lg:h-[calc(100vh-2rem)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <GlassCard className="flex h-full flex-1 flex-col lg:overflow-y-auto">
        <div className="sticky top-0 z-10 flex justify-between border-b border-border bg-card/60 backdrop-blur-md p-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {id ? "Edit Invoice" : "Create Invoice"}
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {invoiceNumber || "New Invoice"} •{" "}
              <span className={`ml-1 font-medium capitalize ${
                status === "paid" ? "text-blue-600 dark:text-blue-400" :
                status === "sent" ? "text-emerald-600 dark:text-emerald-400" :
                status === "overdue" ? "text-red-600 dark:text-red-400" :
                "text-muted-foreground"
              }`}>{status}</span>
            </p>
          </div>
          
          {errors.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
              <AlertCircle className="h-4 w-4" />
              {errors.length} issue{errors.length > 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div className="p-6 space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Invoice Number *</label>
              <input 
                type="text" 
                placeholder="INV-0001"
                className={`w-full px-4 py-2.5 border border-border bg-input-background rounded-xl focus:outline-none focus:ring-2 text-foreground ${
                  getFieldError("invoiceNumber") 
                    ? "border-red-500 focus:ring-red-500/50" 
                    : "border-border focus:ring-emerald-500/50"
                }`}
                value={invoiceNumber}
                onChange={(e) => { setInvoiceNumber(e.target.value); setErrors(prev => prev.filter(e => e.field !== "invoiceNumber")); }}
              />
              {getFieldError("invoiceNumber") && (
                <p className="text-xs text-red-500">{getFieldError("invoiceNumber")}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Client *</label>
              <select 
                className={`w-full px-4 py-2.5 border border-border bg-input-background rounded-xl appearance-none focus:outline-none focus:ring-2 text-foreground ${
                  getFieldError("client") 
                    ? "border-red-500 focus:ring-red-500/50" 
                    : "border-border focus:ring-emerald-500/50"
                }`}
                value={client}
                onChange={(e) => handleClientChange(e.target.value)}
              >
                <option value="" disabled>Select a client...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} {c.email ? `(${c.email})` : ""}</option>
                ))}
              </select>
              {getFieldError("client") && (
                <p className="text-xs text-red-500">{getFieldError("client")}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Issue Date *</label>
              <div className="relative">
                <input 
                  type="date" 
                  className={`w-full px-10 py-2.5 border border-border bg-input-background rounded-xl focus:outline-none focus:ring-2 text-foreground ${
                    getFieldError("issueDate") 
                      ? "border-red-500 focus:ring-red-500/50" 
                      : "border-border focus:ring-emerald-500/50"
                  }`}
                  value={issueDate}
                  onChange={(e) => { setIssueDate(e.target.value); setErrors(prev => prev.filter(e => e.field !== "issueDate")); }}
                />
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              {getFieldError("issueDate") && (
                <p className="text-xs text-red-500">{getFieldError("issueDate")}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Due Date *</label>
              <div className="relative">
                <input 
                  type="date" 
                  className={`w-full px-10 py-2.5 border border-border bg-input-background rounded-xl focus:outline-none focus:ring-2 text-foreground ${
                    getFieldError("dueDate") 
                      ? "border-red-500 focus:ring-red-500/50" 
                      : "border-border focus:ring-emerald-500/50"
                  }`}
                  value={dueDate}
                  onChange={(e) => { setDueDate(e.target.value); setErrors(prev => prev.filter(e => e.field !== "dueDate")); }}
                />
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
              {getFieldError("dueDate") && (
                <p className="text-xs text-red-500">{getFieldError("dueDate")}</p>
              )}
            </div>
          </div>

          {selectedClientData && (
            <div className="p-4 border border-border rounded-xl bg-accent/60">
              <p className="text-sm font-medium text-foreground">{selectedClientData.name}</p>
              <p className="text-sm text-muted-foreground">{selectedClientData.email}</p>
              {selectedClientData.phone && <p className="text-sm text-muted-foreground">{selectedClientData.phone}</p>}
              {selectedClientData.address && <p className="text-sm text-muted-foreground">{selectedClientData.address}</p>}
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-lg font-semibold tracking-tight border-b border-border pb-2">Line Items</h3>
            
            <div className="hidden md:grid grid-cols-12 gap-3 px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="col-span-4">Description</div>
              <div className="col-span-2">Unit</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Rate</div>
              <div className="col-span-1 text-right">Disc%</div>
              <div className="col-span-1"></div>
            </div>
            
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -16, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-accent/50 p-3 rounded-xl border border-border"
                >
                  <div className="col-span-1 md:col-span-4">
                    <input 
                      type="text" 
                      placeholder="Item description"
                      className="w-full bg-transparent border-none focus:ring-0 text-foreground font-medium"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <select 
                      className="w-full border border-border bg-input-background rounded-lg px-2 py-2 text-sm text-foreground"
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                    >
                      {unitOptions.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <input 
                      type="number" 
                      min="0"
                      step="0.01"
                      className="w-full border border-border bg-input-background rounded-lg px-3 py-2 text-center text-foreground"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <input 
                      type="number" 
                      min="0"
                      step="0.01"
                      className="w-full border border-border bg-input-background rounded-lg px-3 py-2 text-right text-foreground"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-1">
                    <input 
                      type="number" 
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full border border-border bg-input-background rounded-lg px-2 py-2 text-center text-foreground text-sm"
                      value={item.discount}
                      onChange={(e) => updateItem(item.id, "discount", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors active:scale-90"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button 
              onClick={addItem}
              className="group flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors py-2 active:scale-[0.98]"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-600/10 transition-transform group-hover:rotate-90">
                <Plus className="w-4 h-4" />
              </span>
              Add Line Item
            </button>
            {getFieldError("items") && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {getFieldError("items")}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">Notes</label>
            <textarea 
              className="w-full px-4 py-3 border border-border bg-input-background rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-foreground placeholder:text-muted-foreground resize-none"
              rows={3}
              placeholder="Payment terms, bank details, or other notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="p-6 border-t border-border bg-card/60 backdrop-blur-md sticky bottom-0 z-10 flex flex-wrap gap-3 mt-auto">
          <button
            onClick={() => handleSave(true)}
            disabled={isLoading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-card text-foreground border border-border rounded-xl font-medium shadow-e1 hover:bg-accent transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" /> : <Save className="w-4 h-4" />} 
            <span className="hidden sm:inline">Save Draft</span>
          </button>
          
          <button
            onClick={handleSend}
            disabled={isLoading || (status !== "draft" && status !== "sent")}
            className="flex-1 sm:flex-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-e1 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" /> Send Invoice
              </>
            )}
          </button>
        </div>
      </GlassCard>

      <GlassCard className="hidden w-[420px] shrink-0 flex-col overflow-y-auto p-6 lg:flex">
        <h3 className="mb-4 text-center font-ledger text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Invoice Preview
        </h3>

        <div className="paper relative flex min-h-[600px] flex-col overflow-hidden rounded-lg shadow-e2">
          <span
            aria-hidden
            className="pointer-events-none absolute -right-4 -top-8 select-none font-display text-[150px] font-bold leading-none text-emerald-600/5"
          >
            ₦
          </span>

          <div className="flex flex-1 flex-col p-6">
            <div className="mb-6 flex items-start justify-between">
              <div>
                {userProfile?.logoUrl ? (
                  <img src={userProfile.logoUrl} alt="Logo" className="mb-3 h-12 w-12 rounded-xl object-cover" />
                ) : (
                  <div
                    className="mb-3 grid h-12 w-12 place-items-center rounded-xl font-display text-xl font-bold text-white"
                    style={{ backgroundColor: userProfile?.brandColor || "#10b981" }}
                  >
                    {userProfile?.name?.charAt(0) || userProfile?.businessName?.charAt(0) || "U"}
                  </div>
                )}
                <p className="font-ledger text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Invoice
                </p>
                <p className="mt-0.5 font-ledger text-base font-semibold tracking-tight text-foreground">
                  {invoiceNumber || "—"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Status: <span className="font-medium uppercase">{status}</span>
                </p>
              </div>
              <div className="text-right">
                <p
                  className="text-sm font-bold tracking-tight"
                  style={{ color: userProfile?.brandColor || "#10b981" }}
                >
                  {userProfile?.businessName || userProfile?.name?.split("@")[0] || "Business Name"}
                </p>
                <p className="mt-1 max-w-[160px] text-xs text-muted-foreground">
                  {userProfile?.businessAddress || userProfile?.email}
                </p>
              </div>
            </div>

            <div className="mb-6 flex justify-between text-sm">
              <div>
                <p className="mb-1 font-ledger text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Bill To
                </p>
                <p className="font-semibold text-foreground">
                  {selectedClientData?.name || "Select a client"}
                </p>
                {selectedClientData?.email && (
                  <p className="text-xs text-muted-foreground">{selectedClientData.email}</p>
                )}
              </div>
              <div className="text-right">
                <p className="mb-1 font-ledger text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Issue Date
                </p>
                <p className="font-medium text-foreground">
                  {issueDate ? new Date(issueDate).toLocaleDateString() : "—"}
                </p>
                <p className="mb-1 mt-2 font-ledger text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Due Date
                </p>
                <p className="font-medium text-red-600 dark:text-red-400">
                  {dueDate ? new Date(dueDate).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>

            <div className="flex-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="paper-line border-b text-left font-ledger text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    <th className="py-2 font-medium">Description</th>
                    <th className="py-2 text-center font-medium">Qty</th>
                    <th className="py-2 text-right font-medium">Rate</th>
                    <th className="py-2 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="paper-line divide-y divide-[color:var(--paper-line)]">
                  {items.map((item) => {
                    const lineTotal = item.quantity * item.rate;
                    const afterDiscount = lineTotal - lineTotal * (item.discount / 100);
                    return (
                      <tr key={item.id}>
                        <td className="py-2 font-medium text-foreground">
                          {item.description || "Item description"}
                          {item.discount > 0 && (
                            <span className="ml-1 text-xs text-amber-600">(-{item.discount}%)</span>
                          )}
                        </td>
                        <td className="py-2 text-center font-ledger text-xs text-muted-foreground">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-2 text-right font-ledger text-xs text-muted-foreground">
                          {formatCurrency(item.rate)}
                        </td>
                        <td className="py-2 text-right font-ledger font-medium text-foreground">
                          {formatCurrency(afterDiscount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="paper-line mt-6 flex flex-col items-end gap-2 border-t pt-4">
              <div className="flex w-48 justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-ledger font-medium text-foreground">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              {vatEnabled && (
                <div className="flex w-48 justify-between text-sm">
                  <span className="text-muted-foreground">VAT ({taxRate}%)</span>
                  <span className="font-ledger font-medium text-foreground">
                    {formatCurrency(calculatedVat)}
                  </span>
                </div>
              )}
              <div
                className="mt-2 flex w-48 items-center justify-between border-t-2 border-foreground pt-2"
              >
                <span className="text-sm font-bold">Total Due</span>
                <span
                  className="font-ledger text-lg font-bold tracking-tight"
                  style={{ color: userProfile?.brandColor || "#10b981" }}
                >
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {notes && (
              <div className="paper-line mt-6 border-t pt-4 text-xs text-muted-foreground">
                <p className="mb-1 font-medium text-foreground">Notes</p>
                <p>{notes}</p>
              </div>
            )}

            <div className="paper-line mt-auto border-t pt-6 text-center text-xs text-muted-foreground">
              {userProfile?.bankName && userProfile?.accountNumber ? (
                <p>
                  Payment:{" "}
                  <span className="font-medium text-foreground">{userProfile.bankName}</span> —{" "}
                  <span className="font-medium text-foreground">{userProfile.accountNumber}</span> (
                  {userProfile.accountName})
                </p>
              ) : (
                <p>Payment details not configured</p>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}