import { useEffect, useState, useCallback } from "react";
import {
  Users,
  UserPlus,
  FileText,
  Receipt,
  Wallet,
  AlertTriangle,
  TrendingUp,
  Megaphone,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../../lib/api";

interface Overview {
  totalUsers: number;
  signupsThisMonth: number;
  totalInvoices: number;
  invoicesCreatedThisMonth: number;
  totalMarketers: number;
  paidRevenue: number;
  outstanding: number;
  overdue: number;
  revenueByMonth: { month: string; revenue: number; volume: number }[];
  recentUsers: { id: string; name: string; email: string; business_name?: string; created_at: string }[];
}

const naira = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: string;
  hint?: string;
}) {
  return (
    <Card className="rounded-2xl border-border bg-white/60 backdrop-blur-xl dark:bg-card/60">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{label}</p>
          <div className={`grid h-9 w-9 place-items-center rounded-xl text-white ${accent}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  );
}

export function AdminDashboard() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const d = await api.getAdminOverview();
      setData(d);
    } catch (err: any) {
      toast.error(err.message || "Failed to load overview");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const chartData = data.revenueByMonth.map((m) => ({
    name: new Date(m.month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
    revenue: m.revenue,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold" style={{ fontFamily: "Poppins, sans-serif" }}>
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Platform overview for {new Date().toLocaleDateString("en-US", { dateStyle: "long" })}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => load()}>
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Users}
          label="Total Users"
          value={String(data.totalUsers)}
          hint={`+${data.signupsThisMonth} this month`}
          accent="bg-emerald-600"
        />
        <StatCard
          icon={FileText}
          label="Invoices"
          value={String(data.totalInvoices)}
          hint={`+${data.invoicesCreatedThisMonth} this month`}
          accent="bg-blue-600"
        />
        <StatCard
          icon={Wallet}
          label="Paid Revenue"
          value={naira(data.paidRevenue)}
          accent="bg-emerald-700"
        />
        <StatCard
          icon={Receipt}
          label="Outstanding"
          value={naira(data.outstanding)}
          hint={`${naira(data.overdue)} overdue`}
          accent="bg-amber-600"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-border bg-white/60 backdrop-blur-xl dark:bg-card/60 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              Revenue trend
            </CardTitle>
            <CardDescription>Paid invoice value over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/60" vertical={false} />
                  <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `₦${Math.round(v / 1000)}k`}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.04)" }}
                    formatter={(value: number) => [naira(value), "Revenue"]}
                    contentStyle={{ borderRadius: 12, border: "1px solid var(--border)" }}
                  />
                  <Bar dataKey="revenue" fill="#059669" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <StatCard
              icon={UserPlus}
              label="Signups (month)"
              value={String(data.signupsThisMonth)}
              accent="bg-blue-500"
            />
            <StatCard
              icon={Megaphone}
              label="Marketers"
              value={String(data.totalMarketers)}
              accent="bg-violet-600"
            />
          </div>

          <Card className="rounded-2xl border-border bg-white/60 backdrop-blur-xl dark:bg-card/60">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4 text-emerald-600" />
                Recent signups
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.recentUsers.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">No signups yet</p>
              )}
              {data.recentUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-500/80 to-blue-500/80 text-xs font-bold text-white">
                    {(u.name || "?")[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{u.name || "—"}</p>
                    <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))}
              {data.totalUsers > 0 && (
                <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {data.totalUsers} total users
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}