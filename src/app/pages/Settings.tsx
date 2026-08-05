import { useState, useEffect } from "react";
import { GlassCard } from "../components/GlassCard";
import { UploadCloud, Building2, Landmark, CreditCard, Save, Plus, Trash2, Percent } from "lucide-react";
import { toast } from "sonner";
import api from "../lib/api";

interface TaxRate {
  id: string;
  name: string;
  rate: number;
  isDefault: boolean;
}

export function Settings() {
  const [settings, setSettings] = useState<any>({
    businessName: "",
    businessAddress: "",
    phone: "",
    bankName: "",
    accountNumber: "",
    accountName: ""
  });
  
  const [taxRates, setTaxRates] = useState<TaxRate[]>([]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { user } = await api.getMe();

        let hydratedSettings: any = {
          businessName: user?.business_name || user?.name?.split('@')[0] || "",
          businessAddress: user?.business_address || "",
          phone: user?.phone || "",
          bankName: user?.bank_name || "",
          accountNumber: user?.account_number || "",
          accountName: user?.account_name || ""
        };

        const rawParams = localStorage.getItem("involink_user_settings");
        if (rawParams) {
          const parsed = JSON.parse(rawParams);
          // Backend is the source of truth for business/payment fields
          hydratedSettings = { ...parsed, ...hydratedSettings };
        }
        setSettings(hydratedSettings);
      } catch (err) {
        // Fallback to local storage
        const rawParams = localStorage.getItem("involink_user_settings");
        if (rawParams) {
          try {
            const parsed = JSON.parse(rawParams);
            setSettings(parsed);
          } catch (e) {}
        }
      }
    };

    const loadTaxRates = async () => {
      try {
        const rates = await api.getTaxRates();
        if (Array.isArray(rates) && rates.length > 0) {
          setTaxRates(rates.map((r: any) => ({
            id: r.id,
            name: r.name,
            rate: Number(r.rate),
            isDefault: Boolean(r.is_default)
          })));
          return;
        }
      } catch (e) {
        console.error("Failed to load tax rates from server:", e);
      }
      // Fallback to local storage
      const rawParams = localStorage.getItem("involink_user_settings");
      if (rawParams) {
        try {
          const parsed = JSON.parse(rawParams);
          if (parsed.taxRates) setTaxRates(parsed.taxRates);
        } catch (e) {}
      }
    };

    loadSettings();
    loadTaxRates();
  }, []);

  const handleSave = async () => {
    try {
      const rawParams = localStorage.getItem("involink_user_settings") || "{}";
      const parsed = JSON.parse(rawParams);
      localStorage.setItem("involink_user_settings", JSON.stringify({
        ...parsed,
        ...settings,
        taxRates
      }));

      await api.updateProfile({
        business_name: settings.businessName,
        business_address: settings.businessAddress,
        phone: settings.phone,
        bank_name: settings.bankName,
        account_number: settings.accountNumber,
        account_name: settings.accountName
      });

      toast.success("Settings saved successfully");
    } catch (e) {
      console.error(e);
      toast.error("Failed to sync settings with server");
    }
  };

  const addTaxRate = async () => {
    try {
      const created = await api.createTaxRate({ name: "New Tax", rate: 0, isDefault: false });
      setTaxRates([...taxRates, {
        id: created.id,
        name: created.name,
        rate: Number(created.rate),
        isDefault: Boolean(created.is_default)
      }]);
    } catch (e) {
      console.error(e);
      toast.error("Failed to add tax rate");
    }
  };

  const removeTaxRate = async (id: string) => {
    if (taxRates.length === 1) {
      toast.error("At least one tax rate is required");
      return;
    }
    try {
      await api.deleteTaxRate(id);
      setTaxRates(taxRates.filter(t => t.id !== id));
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete tax rate");
    }
  };

  const updateTaxRate = async (id: string, field: keyof TaxRate, value: any) => {
    const next = taxRates.map(t => t.id === id ? { ...t, [field]: value } : t);
    setTaxRates(next);
    const target = next.find(t => t.id === id);
    if (!target) return;
    try {
      await api.updateTaxRate(id, {
        name: target.name,
        rate: target.rate,
        isDefault: target.isDefault
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to save tax rate");
    }
  };

  const setDefaultTax = async (id: string) => {
    setTaxRates(taxRates.map(t => ({ ...t, isDefault: t.id === id })));
    try {
      await api.updateTaxRate(id, { isDefault: true });
    } catch (e) {
      console.error(e);
      toast.error("Failed to set default tax rate");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      
      <div>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your business details and invoice preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        
        <div className="md:col-span-4 lg:col-span-3 space-y-2">
          <button className="w-full text-left px-4 py-3 bg-card text-emerald-600 dark:text-emerald-400 font-medium rounded-xl border border-border shadow-e2 transition-all backdrop-blur">
            Business Profile
          </button>
          <button className="w-full text-left px-4 py-3 text-muted-foreground hover:bg-accent/70 rounded-xl transition-all">
            Payment Details
          </button>
          <button className="w-full text-left px-4 py-3 text-muted-foreground hover:bg-accent/70 rounded-xl transition-all flex items-center gap-2">
            <Percent className="w-4 h-4" /> Tax Rates
          </button>
        </div>

        <div className="md:col-span-8 lg:col-span-9 space-y-8">
          
          <GlassCard className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold tracking-tight text-foreground mb-6">Business Profile</h2>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  Business Name
                </label>
                <input 
                  type="text" 
                  value={settings.businessName}
                  onChange={e => setSettings({...settings, businessName: e.target.value})}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-foreground placeholder:text-muted-foreground transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">Business Address</label>
                <textarea 
                  value={settings.businessAddress || ""}
                  onChange={e => setSettings({...settings, businessAddress: e.target.value})}
                  placeholder="123 Business Street, City, State"
                  rows={2}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-foreground placeholder:text-muted-foreground transition-all resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <input 
                  type="text" 
                  value={settings.phone || ""}
                  onChange={e => setSettings({...settings, phone: e.target.value})}
                  placeholder="+234 800 123 4567"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-foreground placeholder:text-muted-foreground transition-all"
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold tracking-tight text-foreground mb-2">Payment Details</h2>
            <p className="text-sm text-muted-foreground mb-6">These details appear on your invoices for client payments.</p>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-muted-foreground" />
                    Bank Name
                  </label>
                  <input 
                    type="text" 
                    value={settings.bankName || ""}
                    onChange={e => setSettings({...settings, bankName: e.target.value})}
                    placeholder="Guaranty Trust Bank"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-foreground transition-all"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    Account Number
                  </label>
                  <input 
                    type="text" 
                    value={settings.accountNumber || ""}
                    onChange={e => setSettings({...settings, accountNumber: e.target.value})}
                    placeholder="0123456789"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-foreground transition-all tracking-wider font-mono"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground">Account Name</label>
                <input 
                  type="text" 
                  value={settings.accountName || ""}
                  onChange={e => setSettings({...settings, accountName: e.target.value})}
                  placeholder="Your Business Name"
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-foreground transition-all"
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">Tax Rates</h2>
                <p className="text-sm text-muted-foreground mt-1">Configure applicable tax rates for your invoices.</p>
              </div>
              <button
                onClick={addTaxRate}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-emerald-50/80 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-500/30 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            
            <div className="space-y-3">
              {taxRates.map((tax) => (
                <div key={tax.id} className="flex items-center gap-3 p-3 bg-input-background rounded-xl border border-border">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      value={tax.name}
                      onChange={(e) => updateTaxRate(tax.id, "name", e.target.value)}
                      className="px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm"
                      placeholder="Tax name"
                    />
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={tax.rate}
                        onChange={(e) => updateTaxRate(tax.id, "rate", parseFloat(e.target.value) || 0)}
                        className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm"
                        step="0.01"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDefaultTax(tax.id)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                        tax.isDefault 
                          ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30" 
                          : "bg-accent text-muted-foreground border-border hover:bg-accent/70"
                      }`}
                    >
                      {tax.isDefault ? "Default" : "Set Default"}
                    </button>
                    
                    <button
                      onClick={() => removeTaxRate(tax.id)}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-e2 transition-all active:scale-95 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-500 ease-out -skew-x-12 -translate-x-full" />
              <Save className="w-5 h-5" /> Save Changes
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}