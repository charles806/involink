import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router";
import { 
  Building2, 
  Palette, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  UploadCloud,
  ArrowLeft,
  Briefcase
} from "lucide-react";
import { toast } from "sonner";
import api from "../lib/api";

type OnboardingData = {
  businessType: string;
  workflow: string;
  industry: string;
  businessAddress: string;
  defaultCurrency: string;
  brandColor: string;
  logoUrl: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  defaultPaymentTerms: string;
  taxName: string;
  taxPercentage: number;
  startingInvoiceNumber: string;
};

const initialData: OnboardingData = {
  businessType: "",
  workflow: "",
  industry: "",
  businessAddress: "",
  defaultCurrency: "NGN",
  brandColor: "#10b981", // default emerald-500
  logoUrl: "",
  bankName: "",
  accountNumber: "",
  accountName: "",
  defaultPaymentTerms: "Due on Receipt",
  taxName: "VAT",
  taxPercentage: 7.5,
  startingInvoiceNumber: "INV-0001"
};

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Attempt to load interrupted session
    const draft = localStorage.getItem("involink_onboarding_draft");
    if (draft) {
      setData(JSON.parse(draft));
    }
    
    // Check if they are actually logged in
    if (!api.getToken()) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("involink_onboarding_draft", JSON.stringify(data));
  }, [data]);

  const updateData = (fields: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...fields }));
  };

  const handleNext = () => setStep((s) => Math.min(s + 1, 4));
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // In a real DB scenario, we would POST this to the backend
      // For now we lock it into localStorage to act as their active settings
      localStorage.setItem("involink_user_settings", JSON.stringify({
        ...data,
        onboardingCompleted: true
      }));
      localStorage.removeItem("involink_onboarding_draft");
      
      toast.success("Account setup successful!");
      // Send them immediately to build a highly contextualized real invoice
      navigate("/app/invoices/new");
    } catch (err: any) {
      toast.error("Failed to complete setup.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentProgress = (step / 4) * 100;

  const steps = [
    { title: "Business", icon: Building2 },
    { title: "Brand", icon: Palette },
    { title: "Payments", icon: CreditCard },
    { title: "Invoicing", icon: FileText }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center font-sans relative overflow-hidden transition-colors duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-background to-blue-50 dark:from-emerald-950/20 dark:via-background dark:to-blue-950/20 z-0" />
      
      {/* Background decorations */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full z-0" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full z-0" />

      {/* Header */}
      <header className="w-full max-w-3xl mx-auto p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold opacity-80">
            In
          </div>
          <span className="font-display font-semibold tracking-tight text-foreground">Involink Setup</span>
        </div>
        <p className="text-sm font-medium text-muted-foreground">Step {step} of 4</p>
      </header>

      {/* Progress Line */}
      <div className="w-full max-w-3xl mx-auto relative h-1 bg-accent rounded-full z-10 overflow-hidden mb-8">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-emerald-500" 
          initial={{ width: 0 }}
          animate={{ width: `${currentProgress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <main className="flex-1 w-full max-w-xl mx-auto relative z-10 px-4 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card/70 border border-border backdrop-blur-xl p-8 rounded-3xl shadow-e3"
          >
            {step === 1 && (
              <Step1Business data={data} updateData={updateData} onNext={handleNext} />
            )}
            {step === 2 && (
              <Step2Branding data={data} updateData={updateData} onNext={handleNext} onPrev={handlePrev} />
            )}
            {step === 3 && (
              <Step3Payments data={data} updateData={updateData} onNext={handleNext} onPrev={handlePrev} />
            )}
            {step === 4 && (
              <Step4Metadata data={data} updateData={updateData} onComplete={handleComplete} onPrev={handlePrev} isLoading={isLoading} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}


/* --- Step 1: Business Operations --- */
function Step1Business({ data, updateData, onNext }: any) {
  const isValid = data.businessType && data.businessAddress;

  const businessTypeOptions = [
    { value: "freelancer", label: "Freelancer / Sole Trader" },
    { value: "agency", label: "Agency / Studio" },
    { value: "llc", label: "LLC / Corporation" },
    { value: "enterprise", label: "Enterprise" },
    { value: "consultancy", label: "Consultancy" },
    { value: "nonprofit", label: "Non-Profit / NGO" },
    { value: "educational", label: "Educational / Tutoring" },
    { value: "logistics", label: "Logistics / Delivery" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "retail", label: "Retail / Commerce" },
  ];

  const workflowOptions = [
    { value: "email", label: "Email a payment link", desc: "Fastest way to get paid online" },
    { value: "chat", label: "Share a link on WhatsApp / chat", desc: "Send and follow up in your chats" },
    { value: "pdf", label: "Attach a PDF invoice", desc: "Email a PDF and collect payment manually" },
    { value: "pos", label: "Collect in-person (POS / cash)", desc: "Use at the point of sale" },
  ];

  const industryOptions = [
    { value: "tech", label: "Tech / IT" },
    { value: "consulting", label: "Consulting" },
    { value: "creative", label: "Creative / Design" },
    { value: "construction", label: "Construction" },
    { value: "retail", label: "Retail / Logistics" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "real-estate", label: "Real Estate" },
    { value: "media", label: "Media / Marketing" },
    { value: "food", label: "Food / Hospitality" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-4">
          <Building2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Tell us about your business</h2>
        <p className="text-sm text-muted-foreground mt-1">This helps us format your invoices correctly.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Business Type</label>
          <div className="relative">
            <select 
              value={data.businessType} 
              onChange={e => updateData({ businessType: e.target.value })}
              className="w-full appearance-none pl-10 pr-4 py-3 rounded-xl bg-input-background border border-border text-foreground focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
            >
              <option value="" disabled>Select category...</option>
              {businessTypeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <Briefcase className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Business Address</label>
          <textarea 
            value={data.businessAddress} 
            onChange={e => updateData({ businessAddress: e.target.value })}
            placeholder="123 Creator St, Lagos LP 100234"
            className="w-full p-4 rounded-xl bg-input-background border border-border text-foreground focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 resize-none h-24"
          />
          <p className="text-xs text-muted-foreground mt-1">This appears on the header of all outgoing invoices.</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">How do you usually get paid?</label>
          <div className="grid grid-cols-1 gap-2">
            {workflowOptions.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateData({ workflow: opt.value })}
                className={`group w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                  data.workflow === opt.value
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 ring-2 ring-emerald-500/30 shadow-e1"
                    : "border-border bg-input-background hover:border-emerald-500/50"
                }`}
              >
                <span>
                  <span className="block text-sm font-medium text-foreground">{opt.label}</span>
                  <span className="block text-xs text-muted-foreground mt-0.5">{opt.desc}</span>
                </span>
                <span
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    data.workflow === opt.value
                      ? "border-emerald-500 bg-emerald-500"
                      : "border-border group-hover:border-emerald-500/50"
                  }`}
                >
                  {data.workflow === opt.value && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">What industry are you in?</label>
          <select 
            value={data.industry} 
            onChange={e => updateData({ industry: e.target.value })}
            className="w-full appearance-none pl-4 pr-4 py-3 rounded-xl bg-input-background border border-border text-foreground focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
          >
            <option value="" disabled>Select industry...</option>
            {industryOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Default Currency</label>
          <div className="relative">
            <input 
              type="text"
              value="Nigerian Naira (₦)"
              disabled
              className="w-full px-4 py-3 rounded-xl bg-accent/50 border border-border text-foreground cursor-not-allowed"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-emerald-600 dark:text-emerald-400">NGN only</span>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <button 
          onClick={onNext}
          disabled={!isValid}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-e2 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
        >
          Next Step <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* --- Step 2: Branding --- */
function Step2Branding({ data, updateData, onNext, onPrev }: any) {
  const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#1f2937"];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4">
          <Palette className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Make it yours</h2>
        <p className="text-sm text-muted-foreground mt-1">Add your brand flair to leave a lasting impression.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">Brand Logo</label>
          <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-input-background hover:bg-accent/40 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-card shadow-e1 flex items-center justify-center group-hover:scale-105 transition-transform">
              <UploadCloud className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Click to upload logo</p>
              <p className="text-xs text-muted-foreground">SVG, PNG, or JPG (max. 2MB)</p>
            </div>
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium mb-3 text-muted-foreground">Accent Color</label>
           <div className="flex flex-wrap gap-3">
             {colors.map(c => (
               <button
                 key={c}
                 onClick={() => updateData({ brandColor: c })}
                 className={`w-10 h-10 rounded-full transition-transform ${data.brandColor === c ? 'scale-110 ring-4 ring-offset-2 ring-offset-card ring-emerald-500/50' : 'hover:scale-105'}`}
                 style={{ backgroundColor: c }}
               />
             ))}
           </div>
        </div>
      </div>

      <div className="pt-6 flex gap-3">
        <button onClick={onPrev} className="px-5 py-3.5 bg-accent text-foreground rounded-xl font-medium hover:bg-accent/70 transition">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button onClick={onNext} className="flex-1 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 border border-transparent rounded-xl font-semibold shadow-md transition-all flex justify-center items-center gap-2">
          Skip for now <ArrowRight className="w-4 h-4" />
        </button>
        <button onClick={onNext} className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-e2 transition-all">
          Continue
        </button>
      </div>
    </div>
  );
}

/* --- Step 3: Payment Rules --- */
function Step3Payments({ data, updateData, onNext, onPrev }: any) {
  const isValid = data.bankName && data.accountNumber && data.accountName;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-4">
          <CreditCard className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">How you get paid</h2>
        <p className="text-sm text-muted-foreground mt-1">This goes at the bottom of your invoices automatically.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Bank Name</label>
          <input 
            type="text"
            value={data.bankName} 
            onChange={e => updateData({ bankName: e.target.value })}
            placeholder="e.g. Guarantee Trust Bank"
            className="w-full p-3 rounded-xl bg-input-background border border-border text-foreground focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Account Number</label>
            <input 
              type="text"
              pattern="[0-9]*" // enforces numeric suggestion
              value={data.accountNumber} 
              onChange={e => updateData({ accountNumber: e.target.value })}
              placeholder="0123456789"
              className="w-full p-3 rounded-xl bg-input-background border border-border text-foreground focus:ring-2 focus:ring-emerald-500/40 font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Account Name</label>
            <input 
              type="text"
              value={data.accountName} 
              onChange={e => updateData({ accountName: e.target.value })}
              placeholder="Your Name / Business"
              className="w-full p-3 rounded-xl bg-input-background border border-border text-foreground focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="pt-4 grid grid-cols-2 gap-4 border-t border-border">
           <div>
             <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Payment Terms</label>
             <select 
               value={data.defaultPaymentTerms} 
               onChange={e => updateData({ defaultPaymentTerms: e.target.value })}
               className="w-full p-3 rounded-xl bg-input-background border border-border text-foreground focus:ring-2 focus:ring-emerald-500/40"
             >
               <option value="Due on Receipt">Due on Receipt</option>
               <option value="Net 7">Net 7 Days</option>
               <option value="Net 15">Net 15 Days</option>
               <option value="Net 30">Net 30 Days</option>
             </select>
           </div>
           <div>
             <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Default Tax (%)</label>
             <div className="relative">
               <input 
                 type="number"
                 step="0.1"
                 value={data.taxPercentage} 
                 onChange={e => updateData({ taxPercentage: parseFloat(e.target.value) || 0 })}
                 className="w-full p-3 rounded-xl bg-input-background border border-border text-foreground focus:ring-2 focus:ring-emerald-500/40"
               />
             </div>
           </div>
        </div>
      </div>

      <div className="pt-6 flex gap-3">
        <button onClick={onPrev} className="px-5 py-3.5 bg-accent text-foreground rounded-xl font-medium hover:bg-accent/70 transition">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-e2 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
        >
          Next Step <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/* --- Step 4: Metadata Structure --- */
function Step4Metadata({ data, updateData, onComplete, onPrev, isLoading }: any) {
  const isValid = data.startingInvoiceNumber.trim() !== "";

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-4">
          <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Almost there!</h2>
        <p className="text-sm text-muted-foreground mt-1">Let's set up your structural formatting.</p>
      </div>

      <div className="space-y-4 h-32">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Starting Invoice Number</label>
          <input 
            type="text"
            value={data.startingInvoiceNumber} 
            onChange={e => updateData({ startingInvoiceNumber: e.target.value.toUpperCase() })}
            placeholder="INV-0001"
            className="w-full text-lg font-semibold font-mono tracking-wider uppercase p-4 rounded-xl bg-input-background border border-border text-foreground focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 text-center"
          />
          <p className="text-xs text-center text-muted-foreground mt-2">New invoices will auto-increment from this sequence.</p>
        </div>
      </div>

      <div className="pt-6 flex gap-3">
        <button disabled={isLoading} onClick={onPrev} className="px-5 py-3.5 bg-accent text-foreground rounded-xl font-medium hover:bg-accent/70 transition disabled:opacity-50">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={onComplete}
          disabled={!isValid || isLoading}
          className="flex-1 py-3.5 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-xl font-semibold shadow-e2 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 dark:border-gray-900/30 border-t-white dark:border-t-gray-900 rounded-full animate-spin" />
          ) : (
            <>
              Complete Setup <CheckCircle2 className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
