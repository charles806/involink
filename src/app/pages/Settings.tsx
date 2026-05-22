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
  
  const [taxRates, setTaxRates] = useState<TaxRate[]>([
    { id: "1", name: "VAT", rate: 7.5, isDefault: true },
    { id: "2", name: "GST", rate: 5, isDefault: false },
  ]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { user } = await api.getMe();
        
        let hydratedSettings: any = { 
          businessName: user?.business_name || user?.name?.split('@')[0] || "",
          bankName: user?.bank_name || "",
          accountNumber: user?.account_number || "",
          accountName: user?.account_name || ""
        };

        const rawParams = localStorage.getItem("involink_user_settings");
        if (rawParams) {
          const parsed = JSON.parse(rawParams);
          // Combine local (phone, address) with backend (bank, business name)
          hydratedSettings = { ...parsed, ...hydratedSettings };
          if (parsed.taxRates) setTaxRates(parsed.taxRates);
        }
        setSettings(hydratedSettings);
      } catch (err) {
        // Fallback to local storage
        const rawParams = localStorage.getItem("involink_user_settings");
        if (rawParams) {
          try {
            const parsed = JSON.parse(rawParams);
            setSettings(parsed);
            if (parsed.taxRates) setTaxRates(parsed.taxRates);
          } catch(e) {}
        }
      }
    };
    
    loadSettings();
  }, []);

  const handleSave = async () => {
    const rawParams = localStorage.getItem("involink_user_settings") || "{}";
    try {
      const parsed = JSON.parse(rawParams);
      localStorage.setItem("involink_user_settings", JSON.stringify({ 
        ...parsed, 
        ...settings,
        taxRates 
      }));

      await api.updateProfile({
        business_name: settings.businessName,
        bank_name: settings.bankName,
        account_number: settings.accountNumber,
        account_name: settings.accountName
      });

      toast.success("Settings saved successfully");
    } catch(e) {
      console.error(e);
      toast.error("Failed to sync settings with server");
    }
  };

  const addTaxRate = () => {
    setTaxRates([...taxRates, { id: Math.random().toString(), name: "New Tax", rate: 0, isDefault: false }]);
  };

  const removeTaxRate = (id: string) => {
    if (taxRates.length === 1) {
      toast.error("At least one tax rate is required");
      return;
    }
    setTaxRates(taxRates.filter(t => t.id !== id));
  };

  const updateTaxRate = (id: string, field: keyof TaxRate, value: any) => {
    setTaxRates(taxRates.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const setDefaultTax = (id: string) => {
    setTaxRates(taxRates.map(t => ({ ...t, isDefault: t.id === id })));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      
      <div>
        <h1 className="text-3xl md:text-4xl font-bold font-['Poppins'] text-gray-900 dark:text-white tracking-tight">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Configure your business details and invoice preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        
        <div className="md:col-span-4 lg:col-span-3 space-y-2">
          <button className="w-full text-left px-4 py-3 bg-white/60 dark:bg-gray-800/60 text-emerald-600 dark:text-emerald-400 font-medium rounded-xl border border-white/50 dark:border-white/10 shadow-sm transition-all shadow-[0_4px_16px_0_rgba(31,38,135,0.05)] backdrop-blur-md">
            Business Profile
          </button>
          <button className="w-full text-left px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-white/40 dark:hover:bg-gray-800/40 rounded-xl transition-all">
            Payment Details
          </button>
          <button className="w-full text-left px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-white/40 dark:hover:bg-gray-800/40 rounded-xl transition-all flex items-center gap-2">
            <Percent className="w-4 h-4" /> Tax Rates
          </button>
        </div>

        <div className="md:col-span-8 lg:col-span-9 space-y-8">
          
          <GlassCard className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold font-['Poppins'] text-gray-900 dark:text-white mb-6">Business Profile</h2>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  Business Name
                </label>
                <input 
                  type="text" 
                  value={settings.businessName}
                  onChange={e => setSettings({...settings, businessName: e.target.value})}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Business Address</label>
                <textarea 
                  value={settings.businessAddress || ""}
                  onChange={e => setSettings({...settings, businessAddress: e.target.value})}
                  placeholder="123 Business Street, City, State"
                  rows={2}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 transition-all resize-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <input 
                  type="text" 
                  value={settings.phone || ""}
                  onChange={e => setSettings({...settings, phone: e.target.value})}
                  placeholder="+234 800 123 4567"
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 transition-all"
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 sm:p-8">
            <h2 className="text-xl font-semibold font-['Poppins'] text-gray-900 dark:text-white mb-2">Payment Details</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">These details appear on your invoices for client payments.</p>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-gray-400" />
                    Bank Name
                  </label>
                  <input 
                    type="text" 
                    value={settings.bankName || ""}
                    onChange={e => setSettings({...settings, bankName: e.target.value})}
                    placeholder="Guaranty Trust Bank"
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-gray-900 dark:text-gray-100 transition-all"
                  />
                </div>
                
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    Account Number
                  </label>
                  <input 
                    type="text" 
                    value={settings.accountNumber || ""}
                    onChange={e => setSettings({...settings, accountNumber: e.target.value})}
                    placeholder="0123456789"
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-gray-900 dark:text-gray-100 transition-all tracking-wider font-mono"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Account Name</label>
                <input 
                  type="text" 
                  value={settings.accountName || ""}
                  onChange={e => setSettings({...settings, accountName: e.target.value})}
                  placeholder="Your Business Name"
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-900/50 border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-gray-900 dark:text-gray-100 transition-all"
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold font-['Poppins'] text-gray-900 dark:text-white">Tax Rates</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure applicable tax rates for your invoices.</p>
              </div>
              <button
                onClick={addTaxRate}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-500/30 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            
            <div className="space-y-3">
              {taxRates.map((tax) => (
                <div key={tax.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-700">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      value={tax.name}
                      onChange={(e) => updateTaxRate(tax.id, "name", e.target.value)}
                      className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 text-sm"
                      placeholder="Tax name"
                    />
                    <div className="flex items-center gap-2">
                      <input 
                        type="number" 
                        value={tax.rate}
                        onChange={(e) => updateTaxRate(tax.id, "rate", parseFloat(e.target.value) || 0)}
                        className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 text-sm"
                        step="0.01"
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDefaultTax(tax.id)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                        tax.isDefault 
                          ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30" 
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {tax.isDefault ? "Default" : "Set Default"}
                    </button>
                    
                    <button
                      onClick={() => removeTaxRate(tax.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
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
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 transition-all active:scale-95 group relative overflow-hidden"
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