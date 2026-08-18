import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import api from "../lib/api";
import { useAuth } from "./AuthContext";

export interface QuotaInfo {
  remaining: number | null;
  used: number | null;
  limit: number | null;
}

export interface SubscriptionFeatures {
  unlimitedInvoices: boolean;
  onlinePayments: boolean;
  multiCurrency: boolean;
  branding: boolean;
  analytics: boolean;
}

export interface Subscription {
  plan: "free" | "pro";
  status: string;
  isPro: boolean;
  expiresAt: string | null;
  freeQuota: number;
  quota: QuotaInfo;
  features: SubscriptionFeatures;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  isLoading: boolean;
  isPro: boolean;
  refresh: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setSubscription(null);
      setIsLoading(false);
      return;
    }
    try {
      const data = await api.getSubscriptionStatus();
      setSubscription(data);
    } catch (err) {
      // Non-critical; UI degrades gracefully.
      console.warn("Failed to load subscription:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setIsLoading(true);
    refresh();
  }, [refresh]);

  const isPro = !!subscription?.isPro;

  return (
    <SubscriptionContext.Provider value={{ subscription, isLoading, isPro, refresh }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}