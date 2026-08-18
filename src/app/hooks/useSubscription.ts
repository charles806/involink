import { useSubscription as useSubscriptionContext } from "../context/SubscriptionContext";

// Thin convenience hook exposing subscription plan + quota.
export function useSubscription() {
  const { subscription, isLoading, isPro, refresh } = useSubscriptionContext();
  return {
    subscription,
    isLoading,
    isPro,
    plan: isPro ? "pro" : "free",
    remainingQuota: subscription?.quota?.remaining ?? null,
    usedQuota: subscription?.quota?.used ?? null,
    quotaLimit: subscription?.quota?.limit ?? null,
    expiresAt: subscription?.expiresAt ?? null,
    refresh,
  };
}

export default useSubscription;