import { useEffect, useState, useCallback } from "react";
import { Search, FileText, Wallet, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../../components/ui/table";
import api from "../../lib/api";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  business_name?: string;
  role: string;
  marketer_id?: string | null;
  marketer_name?: string | null;
  created_at: string;
  stats: { invoices: number; paidRevenue: number; outstanding: number };
}

interface Marketer {
  id: string;
  name: string;
}

export function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [marketers, setMarketers] = useState<Marketer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadMarketers = useCallback(async () => {
    try {
      setMarketers(await api.getMarketers());
    } catch {
      // non-fatal — assignment dropdown just won't show names
    }
  }, []);

  const load = useCallback(async () => {
    try {
      setUsers(await api.getAdminUsers({ search: search || undefined }));
    } catch (err: any) {
      toast.error(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadMarketers();
  }, [loadMarketers]);

  useEffect(() => {
    load();
  }, [load]);

  const assignMarketer = async (userId: string, marketerId: string | null) => {
    setUpdatingId(userId);
    try {
      await api.updateAdminUser(userId, { marketer_id: marketerId });
      toast.success(marketerId ? "Marketer assigned" : "Marketer unassigned");
      await load();
    } catch (err: any) {
      toast.error(err.message || "Failed to assign marketer");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleRole = async (u: AdminUser) => {
    setUpdatingId(u.id);
    try {
      const nextRole = u.role === "admin" ? "user" : "admin";
      await api.updateAdminUser(u.id, { role: nextRole });
      toast.success(nextRole === "admin" ? `${u.name} is now an admin` : `${u.name} is no longer an admin`);
      await load();
    } catch (err: any) {
      toast.error(err.message || "Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold" style={{ fontFamily: "Poppins, sans-serif" }}>
            Users
          </h1>
          <p className="text-sm text-muted-foreground">
            Assign users to marketers and manage admin access
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") setSearch(searchInput.trim());
          }}
          placeholder="Search by name or email…"
          className="pl-9"
        />
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Loading…</p>
      ) : users.length === 0 ? (
        <Card className="rounded-2xl border-border bg-white/60 backdrop-blur-xl dark:bg-card/60">
          <CardContent className="py-16 text-center">
            <p className="font-semibold">No users found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try a different search.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden rounded-2xl border-border bg-white/60 backdrop-blur-xl dark:bg-card/60">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Marketer</TableHead>
                  <TableHead className="text-right">Invoices</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => {
                  const options = [
                    { value: "none", label: "— None —" },
                    ...marketers.map((m) => ({ value: m.id, label: m.name })),
                  ];
                  return (
                    <TableRow key={u.id} className={updatingId === u.id ? "opacity-60" : ""}>
                      <TableCell>
                        <div>
                          <p className="font-semibold">{u.name || "—"}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                          {u.business_name && (
                            <p className="text-xs text-muted-foreground">{u.business_name}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={u.role === "admin" ? "default" : "secondary"}
                          className={
                            u.role === "admin"
                              ? "bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
                              : ""
                          }
                        >
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="min-w-[140px]">
                          <Select
                            key={u.id}
                            value={u.marketer_id || "none"}
                            disabled={updatingId === u.id || marketers.length === 0}
                            onValueChange={(v) => assignMarketer(u.id, v === "none" ? null : v)}
                          >
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue placeholder={u.marketer_name || "Assign…"} />
                            </SelectTrigger>
                            <SelectContent>
                              {options.map((o) => (
                                <SelectItem key={o.value} value={o.value}>
                                  {o.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                          {u.stats.invoices}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                          <Wallet className="h-3.5 w-3.5" />
                          {"₦" + u.stats.paidRevenue.toLocaleString("en-NG")}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={updatingId === u.id}
                          onClick={() => toggleRole(u)}
                          title={u.role === "admin" ? "Revoke admin" : "Grant admin"}
                        >
                          {u.role === "admin" ? "Revoke admin" : "Make admin"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <RefreshCw className="h-3.5 w-3.5" />
        Role and marketer changes apply immediately on next API call.
      </p>
    </div>
  );
}