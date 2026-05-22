import { useState, useEffect, useMemo } from "react";
import { GlassCard } from "../components/GlassCard";
import { Plus, Trash2, Calendar, Send, Save, AlertCircle, Check, Calculator } from "lucide-react";
import { toast } from "sonner";
import api from "../lib/api";
import { useNavigate, useParams } from "react-router";

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

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const lineTotal = item.quantity * item.rate;
      const afterDiscount = lineTotal - (lineTotal * (item.discount / 100));
      return sum + afterDiscount;
    }, 0);
  }, [items]);

  const calculatedVat = vatEnabled ? subtotal * (taxRate / 100) : 0;
  const total = subtotal + calculatedVat;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

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
    
    const itemErrors = items.filter((item, idx) => {
      if (!item.description.trim()) return true;
      if (item.quantity <= 0) return true;
      if (item.rate < 0) return true;
      if (item.discount < 0 || item.discount > 100) return true;
      return false;
    });
    
    if (itemErrors.length > 0) {
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
      
      <GlassCard className="flex-1 flex flex-col h-full lg:overflow-y-auto">
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold font-['Poppins'] text-gray-900 dark:text-white">
              {id ? "Edit Invoice" : "Create Invoice"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {invoiceNumber || "New Invoice"} • 
              <span className={`ml-1 capitalize font-medium ${
                status === "paid" ? "text-blue-600 dark:text-blue-400" :
                status === "sent" ? "text-emerald-600 dark:text-emerald-400" :
                status === "overdue" ? "text-red-600 dark:text-red-400" :
                "text-gray-500"
              }`}>{status}</span>
            </p>
          </div>
          
          {errors.length > 0 && (
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {errors.length} issue{errors.length > 1 ? "s" : ""}
            </div>
          )}
        </div>

        <div className="p-6 space-y-6 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Invoice Number *</label>
              <input 
                type="text" 
                placeholder="INV-0001"
                className={`w-full px-4 py-2.5 bg-white/50 dark:bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 text-gray-900 dark:text-gray-100 ${
                  getFieldError("invoiceNumber") 
                    ? "border-red-500 focus:ring-red-500/50" 
                    : "border-gray-200/50 dark:border-gray-700/50 focus:ring-emerald-500/50"
                }`}
                value={invoiceNumber}
                onChange={(e) => { setInvoiceNumber(e.target.value); setErrors(prev => prev.filter(e => e.field !== "invoiceNumber")); }}
              />
              {getFieldError("invoiceNumber") && (
                <p className="text-xs text-red-500">{getFieldError("invoiceNumber")}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Client *</label>
              <select 
                className={`w-full px-4 py-2.5 bg-white/50 dark:bg-gray-900/50 border rounded-xl appearance-none focus:outline-none focus:ring-2 text-gray-900 dark:text-gray-100 ${
                  getFieldError("client") 
                    ? "border-red-500 focus:ring-red-500/50" 
                    : "border-gray-200/50 dark:border-gray-700/50 focus:ring-emerald-500/50"
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
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Issue Date *</label>
              <div className="relative">
                <input 
                  type="date" 
                  className={`w-full px-10 py-2.5 bg-white/50 dark:bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 text-gray-900 dark:text-gray-100 ${
                    getFieldError("issueDate") 
                      ? "border-red-500 focus:ring-red-500/50" 
                      : "border-gray-200/50 dark:border-gray-700/50 focus:ring-emerald-500/50"
                  }`}
                  value={issueDate}
                  onChange={(e) => { setIssueDate(e.target.value); setErrors(prev => prev.filter(e => e.field !== "issueDate")); }}
                />
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {getFieldError("issueDate") && (
                <p className="text-xs text-red-500">{getFieldError("issueDate")}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Due Date *</label>
              <div className="relative">
                <input 
                  type="date" 
                  className={`w-full px-10 py-2.5 bg-white/50 dark:bg-gray-900/50 border rounded-xl focus:outline-none focus:ring-2 text-gray-900 dark:text-gray-100 ${
                    getFieldError("dueDate") 
                      ? "border-red-500 focus:ring-red-500/50" 
                      : "border-gray-200/50 dark:border-gray-700/50 focus:ring-emerald-500/50"
                  }`}
                  value={dueDate}
                  onChange={(e) => { setDueDate(e.target.value); setErrors(prev => prev.filter(e => e.field !== "dueDate")); }}
                />
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {getFieldError("dueDate") && (
                <p className="text-xs text-red-500">{getFieldError("dueDate")}</p>
              )}
            </div>
          </div>

          {selectedClientData && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">{selectedClientData.name}</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">{selectedClientData.email}</p>
              {selectedClientData.phone && <p className="text-sm text-blue-700 dark:text-blue-300">{selectedClientData.phone}</p>}
              {selectedClientData.address && <p className="text-sm text-blue-700 dark:text-blue-300">{selectedClientData.address}</p>}
            </div>
          )}

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200/50 dark:border-gray-700/50 pb-2">Line Items</h3>
            
            <div className="hidden md:grid grid-cols-12 gap-3 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <div className="col-span-4">Description</div>
              <div className="col-span-2">Unit</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Rate</div>
              <div className="col-span-1 text-right">Disc%</div>
              <div className="col-span-1"></div>
            </div>
            
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-gray-50 dark:bg-gray-800/30 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="col-span-1 md:col-span-4">
                    <input 
                      type="text" 
                      placeholder="Item description"
                      className="w-full bg-transparent border-none focus:ring-0 text-gray-900 dark:text-gray-100 font-medium"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <select 
                      className="w-full bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-lg px-2 py-2 text-sm text-gray-900 dark:text-gray-100"
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
                      className="w-full bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-lg px-3 py-2 text-center text-gray-900 dark:text-gray-100"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <input 
                      type="number" 
                      min="0"
                      step="0.01"
                      className="w-full bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-lg px-3 py-2 text-right text-gray-900 dark:text-gray-100"
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
                      className="w-full bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-lg px-2 py-2 text-center text-gray-900 dark:text-gray-100 text-sm"
                      value={item.discount}
                      onChange={(e) => updateItem(item.id, "discount", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={addItem}
              className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors py-2"
            >
              <Plus className="w-4 h-4" /> Add Line Item
            </button>
            {getFieldError("items") && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {getFieldError("items")}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
            <textarea 
              className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 resize-none"
              rows={3}
              placeholder="Payment terms, bank details, or other notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md sticky bottom-0 z-10 flex flex-wrap gap-3 mt-auto">
          <button
            onClick={() => handleSave(true)}
            disabled={isLoading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200/50 dark:border-gray-600 rounded-xl font-medium shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" /> : <Save className="w-4 h-4" />} 
            <span className="hidden sm:inline">Save Draft</span>
          </button>
          
          <button
            onClick={handleSend}
            disabled={isLoading || (status !== "draft" && status !== "sent")}
            className="flex-1 sm:flex-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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

      <GlassCard className="hidden lg:flex w-[420px] flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900/50 p-6 shrink-0">
        <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 text-center">Invoice Preview</h3>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 font-sans text-gray-900 dark:text-gray-100 flex flex-col min-h-[600px]">
          <div className="flex justify-between items-start mb-6">
            <div>
              {userProfile?.logoUrl ? (
                <img src={userProfile.logoUrl} alt="Logo" className="w-12 h-12 rounded-xl mb-3 object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-3 font-['Poppins']" style={{ backgroundColor: userProfile?.brandColor || '#10b981' }}>
                  {userProfile?.name?.charAt(0) || userProfile?.businessName?.charAt(0) || "U"}
                </div>
              )}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Invoice</p>
              <p className="text-lg font-bold mt-1">{invoiceNumber || "—"}</p>
              <p className="text-xs text-gray-500 mt-1">Status: <span className="uppercase font-medium">{status}</span></p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg" style={{ color: userProfile?.brandColor || '#10b981' }}>
                {userProfile?.businessName || userProfile?.name?.split('@')[0] || "Business Name"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{userProfile?.businessAddress || userProfile?.email}</p>
            </div>
          </div>

          <div className="mb-6 flex justify-between text-sm">
            <div>
              <p className="text-xs text-gray-400 mb-1">Bill To</p>
              <p className="font-semibold">{selectedClientData?.name || "Select a client"}</p>
              {selectedClientData?.email && <p className="text-xs text-gray-500">{selectedClientData.email}</p>}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-1">Issue Date</p>
              <p className="font-medium">{issueDate ? new Date(issueDate).toLocaleDateString() : "—"}</p>
              <p className="text-xs text-gray-400 mt-2 mb-1">Due Date</p>
              <p className="font-medium text-red-600 dark:text-red-400">{dueDate ? new Date(dueDate).toLocaleDateString() : "—"}</p>
            </div>
          </div>

          <div className="flex-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-400 text-xs uppercase">
                  <th className="py-2 text-left font-medium">Description</th>
                  <th className="py-2 text-center font-medium">Qty</th>
                  <th className="py-2 text-right font-medium">Rate</th>
                  <th className="py-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {items.map((item) => {
                  const lineTotal = item.quantity * item.rate;
                  const afterDiscount = lineTotal - (lineTotal * (item.discount / 100));
                  return (
                    <tr key={item.id}>
                      <td className="py-2 font-medium">
                        {item.description || "Item description"}
                        {item.discount > 0 && <span className="text-xs text-amber-600 ml-1">(-{item.discount}%)</span>}
                      </td>
                      <td className="py-2 text-center">{item.quantity} {item.unit}</td>
                      <td className="py-2 text-right">{formatCurrency(item.rate)}</td>
                      <td className="py-2 text-right font-medium">{formatCurrency(afterDiscount)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4 flex flex-col items-end gap-2">
            <div className="flex justify-between w-48 text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            {vatEnabled && (
              <div className="flex justify-between w-48 text-sm">
                <span className="text-gray-500">VAT ({taxRate}%)</span>
                <span className="font-medium">{formatCurrency(calculatedVat)}</span>
              </div>
            )}
            <div className="flex justify-between w-48 text-lg font-bold mt-2 pt-2 border-t border-gray-200 dark:border-gray-700" style={{ color: userProfile?.brandColor || '#10b981' }}>
              <span>Total Due</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          {notes && (
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500">
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</p>
              <p>{notes}</p>
            </div>
          )}

          <div className="mt-auto pt-6 text-xs text-gray-400 dark:text-gray-500 text-center border-t border-gray-100 dark:border-gray-800">
            {userProfile?.bankName && userProfile?.accountNumber ? (
              <p>Payment: <span className="text-gray-600 dark:text-gray-400 font-medium">{userProfile.bankName}</span> — <span className="text-gray-600 dark:text-gray-400 font-medium">{userProfile.accountNumber}</span> ({userProfile.accountName})</p>
            ) : (
              <p>Payment details not configured</p>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}