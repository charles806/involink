import { useState, useEffect, useRef } from "react";
import { GlassCard } from "../components/GlassCard";
import { Search, Plus, UserCircle, MoreHorizontal, Loader2, X, Mail, Phone, MapPin, Building2, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "../lib/api";
import { motion, AnimatePresence, useInView } from "framer-motion";

const ClientModal = ({ isOpen, onClose, client, onSave }: { isOpen: boolean; onClose: () => void; client?: any; onSave: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        email: client.email || "",
        phone: client.phone || "",
        address: client.address || ""
      });
    } else {
      setFormData({ name: "", email: "", phone: "", address: "" });
    }
  }, [client]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Client name is required");
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {client ? "Edit Client" : "Add New Client"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Client or company name"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="client@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="+234 800 000 0000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              placeholder="Client address"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600"
            >
              {client ? "Update" : "Add Client"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const ClientRow = ({ client, index, onEdit, onDelete }: { client: any; index: number; onEdit: () => void; onDelete: () => void }) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800"
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
            <UserCircle className="w-6 h-6" />
          </div>
          <span className="font-medium text-gray-900 dark:text-white">{client.name}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          {client.email && (
            <span className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <Mail className="w-3 h-3 text-gray-400" />
              {client.email}
            </span>
          )}
          {client.phone && (
            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Phone className="w-3 h-3 text-gray-400" />
              {client.phone}
            </span>
          )}
          {!client.email && !client.phone && (
            <span className="text-sm text-gray-400">No contact info</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {client.address || "—"}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
};

export function Clients() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const searchRef = useRef(null);
  const isInView = useInView(searchRef, { once: true });

  useEffect(() => {
    loadClients();
  }, [searchQuery]);

  const loadClients = async () => {
    try {
      const data = await api.getClients(searchQuery);
      setClients(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load clients");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddClient = () => {
    setEditingClient(null);
    setModalOpen(true);
  };

  const handleEditClient = (client: any) => {
    setEditingClient(client);
    setModalOpen(true);
  };

  const handleSaveClient = async (data: any) => {
    setSaving(true);
    try {
      if (editingClient) {
        await api.updateClient(editingClient.id, data);
        toast.success("Client updated!");
      } else {
        await api.createClient(data);
        toast.success("Client added!");
      }
      setModalOpen(false);
      loadClients();
    } catch (err: any) {
      toast.error(err.message || "Failed to save client");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClient = async (client: any) => {
    if (!confirm(`Delete ${client.name}? This will also delete their invoices.`)) return;
    
    try {
      await api.deleteClient(client.id);
      toast.success("Client deleted");
      loadClients();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete client");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Clients</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {clients.length} client{clients.length !== 1 ? "s" : ""} in your roster
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddClient}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/30"
        >
          <Plus className="w-5 h-5" />
          Add Client
        </motion.button>
      </div>

      <GlassCard className="overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 dark:border-gray-800">
          <div ref={searchRef} className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mx-auto" />
            </div>
          ) : clients.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16 px-4"
            >
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                <UserCircle className="w-10 h-10 text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {searchQuery ? "No clients found" : "No clients yet"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm mb-6">
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : "Add your first client to start creating invoices."}
              </p>
              {!searchQuery && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddClient}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Client
                </motion.button>
              )}
            </motion.div>
          ) : (
            <table className="w-full">
              <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800/50 backdrop-blur-md text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
                <tr>
                  <th className="px-6 py-4 text-left">Client</th>
                  <th className="px-6 py-4 text-left">Contact</th>
                  <th className="px-6 py-4 text-left">Address</th>
                  <th className="px-6 py-4 text-right w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                <AnimatePresence>
                  {clients.map((client, i) => (
                    <ClientRow
                      key={client.id}
                      client={client}
                      index={i}
                      onEdit={() => handleEditClient(client)}
                      onDelete={() => handleDeleteClient(client)}
                    />
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </GlassCard>

      <ClientModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        client={editingClient}
        onSave={handleSaveClient}
      />
    </div>
  );
}