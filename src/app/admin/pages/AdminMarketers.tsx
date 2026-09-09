import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  FileText,
  Wallet,
  CircleDollarSign,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../../components/ui/table";
import api from "../../lib/api";

interface Marketer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  created_at: string;
  stats: {
    users: number;
    invoices: number;
    paidRevenue: number;
    outstanding: number;
  };
}

const emptyForm = { name: "", email: "", phone: "" };

export function AdminMarketers() {
  const [marketers, setMarketers] = useState<Marketer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Marketer | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setMarketers(await api.getMarketers());
    } catch (err: any) {
      toast.error(err.message || "Failed to load marketers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (m: Marketer) => {
    setEditing(m);
    setForm({ name: m.name, email: m.email, phone: m.phone || "" });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await api.updateMarketer(editing.id, {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
        });
        toast.success("Marketer updated");
      } else {
        await api.createMarketer({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
        });
        toast.success("Marketer added");
      }
      setDialogOpen(false);
      await load();
    } catch (err: any) {
      toast.error(err.message || "Failed to save marketer");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (m: Marketer) => {
    try {
      await api.updateMarketer(m.id, {
        status: m.status === "active" ? "inactive" : "active",
      });
      toast.success(m.status === "active" ? "Marketer deactivated" : "Marketer activated");
      await load();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await api.deleteMarketer(id);
      toast.success("Marketer deleted");
      await load();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete marketer");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold" style={{ fontFamily: "Poppins, sans-serif" }}>
            Marketers
          </h1>
          <p className="text-sm text-muted-foreground">
            Track the people bringing users onto Involink
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Add marketer
        </Button>
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">Loading…</p>
      ) : marketers.length === 0 ? (
        <Card className="rounded-2xl border-border bg-white/60 backdrop-blur-xl dark:bg-card/60">
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-600/10 text-emerald-600">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">No marketers yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add your first marketer to start attributing signups.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden rounded-2xl border-border bg-white/60 backdrop-blur-xl dark:bg-card/60">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Marketer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Users</TableHead>
                  <TableHead className="text-right">Invoices</TableHead>
                  <TableHead className="text-right">Paid revenue</TableHead>
                  <TableHead className="text-right">Outstanding</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketers.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-xs font-bold text-white">
                          {m.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold">{m.name}</p>
                          <p className="text-xs text-muted-foreground">{m.email}</p>
                          {m.phone && (
                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {m.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <button onClick={() => toggleStatus(m)} title="Toggle status">
                        <Badge
                          variant={m.status === "active" ? "default" : "secondary"}
                          className={
                            m.status === "active"
                              ? "bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/20 dark:text-emerald-400"
                              : ""
                          }
                        >
                          {m.status}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell className="text-right font-medium">{m.stats.users}</TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        {m.stats.invoices}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                        <Wallet className="h-3.5 w-3.5" />
                        {"₦" + m.stats.paidRevenue.toLocaleString("en-NG")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {"₦" + m.stats.outstanding.toLocaleString("en-NG")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" title="Edit" onClick={() => openEdit(m)}>
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete"
                          className="text-red-600 hover:bg-red-500/10"
                          disabled={deletingId === m.id}
                          onClick={() => handleDelete(m.id)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit marketer" : "Add marketer"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Update this marketer's details."
                : "Marketers show up in the drop-down when assigning users."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="mk-name">Name</Label>
              <Input
                id="mk-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Lara Okon"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mk-email">Email</Label>
              <Input
                id="mk-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="lara@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mk-phone">Phone (optional)</Label>
              <Input
                id="mk-phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+234 800 000 0000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : editing ? "Save changes" : "Add marketer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <CircleDollarSign className="h-3.5 w-3.5" />
        Revenue reflects paid invoices from users assigned to each marketer.
      </p>
    </div>
  );
}