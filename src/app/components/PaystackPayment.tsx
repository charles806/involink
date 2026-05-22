import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import api from "../lib/api";

declare global {
  interface Window {
    PaystackPop: {
      new: (config: PaystackConfig) => {
        open: () => void;
      };
    };
  }
}

interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  ref: string;
  callback: (response: { reference: string }) => void;
  onClose: () => void;
  currency?: string;
  channels?: string[];
  metadata?: Record<string, unknown>;
}

interface PaystackPaymentProps {
  invoiceId: string;
  amount: number;
  email: string;
  onSuccess?: (reference: string) => void;
  onClose?: () => void;
}

export function PaystackPayment({ invoiceId, amount, email, onSuccess, onClose }: PaystackPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => setIsInitialized(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!isInitialized) {
      toast.error("Payment system not ready. Please refresh the page.");
      return;
    }

    setIsLoading(true);

    try {
      const paymentData = await api.initializePayment(invoiceId, email);
      
      const paystack = new window.PaystackPop({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "",
        email,
        amount: amount * 100,
        ref: paymentData.reference,
        callback: async (response: { reference: string; }) => {
          try {
            const verification = await api.verifyPayment(response.reference);
            if (verification.success) {
              toast.success("Payment successful!");
              onSuccess?.(response.reference);
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            toast.error("Failed to verify payment");
          } finally {
            setIsLoading(false);
          }
        },
        onClose: () => {
          toast.info("Payment cancelled");
          onClose?.();
          setIsLoading(false);
        },
        currency: "NGN",
        channels: ["card", "bank", "ussd", "mobile_money"],
        metadata: {
          invoiceId,
          custom_fields: [
            {
              display_name: "Invoice ID",
              variable_name: "invoice_id",
              value: invoiceId
            }
          ]
        }
      });

      paystack.open();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to initialize payment";
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef}>
      <button
        onClick={handlePayment}
        disabled={isLoading || !isInitialized}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-4 py-2"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zM6 10h4v4H6v-4zm0 4h8v2H6v-2zm10 0h4v2h-4v-2zm-6-4h8v2H10v-2z"/>
            </svg>
            Pay with Paystack
          </>
        )}
      </button>
      <p className="text-xs text-gray-500 mt-2">
        Secure payment powered by Paystack
      </p>
    </div>
  );
}

export function loadPaystackScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paystack"));
    document.body.appendChild(script);
  });
}