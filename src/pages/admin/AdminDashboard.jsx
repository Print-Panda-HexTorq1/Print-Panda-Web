import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { adminApi } from "../../api";

const WEB_BASE = (import.meta.env.VITE_WEB_BASE || "https://print-panda.me").replace(/\/+$/, "");
const API_BASE = (import.meta.env.VITE_API_BASE || "https://git-pipeline.metatronhost.in/print-panda").replace(/\/+$/, "");
const ADMIN_TOKEN_KEY = "panda_admin_token";
const LEGACY_ADMIN_TOKEN_KEY = "iprint_admin_token";
const LOCAL_AUTH_KEY = "panda_local_auth";

function formatQueueTokenDisplay(queueToken, jobId) {
  const raw = String(queueToken || "").trim();
  if (!raw) {
    return `PP-${jobId}`;
  }
  return raw.replace(/^([A-Za-z]+-?)0+(\d+)$/, "$1$2");
}

function uploadUrl(userUid) {
  return `${WEB_BASE}/u/${userUid}`;
}

// ── Modal wrapper ─────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-ink">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-ink/50 hover:text-ink">✕</button>
        </div>
        <div className="mt-4">{children}</div>
      </motion.div>
    </div>
  );
}

// ── Create / Edit Client Modal ────────────────────────────────────────────────
function ClientFormModal({ client, onClose, onSaved }) {
  const [shopName, setShopName] = useState(client?.shop_name || "");
  const [upiId, setUpiId] = useState(client?.upi_id || "");
  const [upiName, setUpiName] = useState(client?.upi_name || "");
  const [bwPrice, setBwPrice] = useState(Number(client?.bw_price ?? 3));
  const [colorPrice, setColorPrice] = useState(Number(client?.color_price ?? 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!shopName.trim()) { setError("Shop name is required"); return; }
    if (Number(bwPrice) < 0 || Number(colorPrice) < 0) { setError("Prices cannot be negative"); return; }
    try {
      setLoading(true);
      let saved;
      if (client) {
        saved = await adminApi.updateClient(client.id, { shopName, upiId, upiName, bwPrice: Number(bwPrice), colorPrice: Number(colorPrice) });
      } else {
        saved = await adminApi.createClient({ shopName, upiId, upiName, bwPrice: Number(bwPrice), colorPrice: Number(colorPrice) });
      }
      onSaved(saved);
    } catch (err) {
      setError(err.message || "Failed to save client");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={client ? "Edit Shop" : "New Shop / Client"} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block text-sm font-medium text-ink">
          Shop Name *
          <input className="mt-1 w-full rounded-xl border border-ink/20 px-3 py-2 text-sm" value={shopName} onChange={(e) => setShopName(e.target.value)} />
        </label>
        <label className="block text-sm font-medium text-ink">
          UPI ID (e.g. shopname@oksbi)
          <input className="mt-1 w-full rounded-xl border border-ink/20 px-3 py-2 text-sm" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
        </label>
        <label className="block text-sm font-medium text-ink">
          UPI Display Name
          <input className="mt-1 w-full rounded-xl border border-ink/20 px-3 py-2 text-sm" value={upiName} onChange={(e) => setUpiName(e.target.value)} />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm font-medium text-ink">
            B/W Price (Rs per page)
            <input
              className="mt-1 w-full rounded-xl border border-ink/20 px-3 py-2 text-sm"
              type="number"
              min="0"
              step="1"
              value={bwPrice}
              onChange={(e) => setBwPrice(e.target.value)}
            />
          </label>
          <label className="block text-sm font-medium text-ink">
            Color Price (Rs per page)
            <input
              className="mt-1 w-full rounded-xl border border-ink/20 px-3 py-2 text-sm"
              type="number"
              min="0"
              step="1"
              value={colorPrice}
              onChange={(e) => setColorPrice(e.target.value)}
            />
          </label>
        </div>
        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-ink/20 py-2 text-sm font-medium text-ink">Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 rounded-xl bg-ink py-2 text-sm font-semibold text-paper disabled:opacity-50">
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Create User Modal ─────────────────────────────────────────────────────────
function CreateUserModal({ clientId, onClose, onCreated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) { setError("Username and password are required"); return; }
    if (password.length < 4) { setError("Password must be at least 4 characters"); return; }
    try {
      setLoading(true);
      const user = await adminApi.createUser(clientId, { username, password });
      onCreated(user);
    } catch (err) {
      setError(err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="New Desktop User" onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block text-sm font-medium text-ink">
          Username
          <input className="mt-1 w-full rounded-xl border border-ink/20 px-3 py-2 text-sm" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label className="block text-sm font-medium text-ink">
          Password
          <input className="mt-1 w-full rounded-xl border border-ink/20 px-3 py-2 text-sm" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-ink/20 py-2 text-sm font-medium text-ink">Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 rounded-xl bg-ink py-2 text-sm font-semibold text-paper disabled:opacity-50">
            {loading ? "Creating..." : "Create User"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Change Password Modal ─────────────────────────────────────────────────────
function ChangePasswordModal({ user, onClose, onChanged }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 4) { setError("Password must be at least 4 characters"); return; }
    try {
      setLoading(true);
      await adminApi.changeUserPassword(user.id, password);
      onChanged();
    } catch (err) {
      setError(err.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`Change Password — ${user.username}`} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="block text-sm font-medium text-ink">
          New Password
          <input className="mt-1 w-full rounded-xl border border-ink/20 px-3 py-2 text-sm" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        <div className="flex gap-2 pt-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-ink/20 py-2 text-sm font-medium text-ink">Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 rounded-xl bg-ink py-2 text-sm font-semibold text-paper disabled:opacity-50">
            {loading ? "Saving..." : "Update Password"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── QR Preview Modal ──────────────────────────────────────────────────────────
function QrModal({ client, user, onClose }) {
  const url = uploadUrl(user.user_uid);
  return (
    <Modal title="Customer Upload QR Code (Per User)" onClose={onClose}>
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-2xl border border-ink/10 p-4">
          <QRCodeSVG value={url} size={200} />
        </div>
        <p className="text-center text-sm font-medium text-ink">{client.shop_name}</p>
        <p className="text-center text-xs text-ink/70">Operator: {user.username}</p>
        <p className="break-all rounded-xl bg-ink/5 px-3 py-2 text-center text-xs text-ink/70">{url}</p>
        <button
          onClick={() => navigator.clipboard?.writeText(url)}
          className="w-full rounded-xl border border-ink/20 py-2 text-sm font-medium text-ink hover:bg-ink/5"
        >
          Copy URL
        </button>
        <button onClick={() => window.print()} className="w-full rounded-xl bg-ink py-2 text-sm font-semibold text-paper">
          Print / Save as PDF
        </button>
      </div>
    </Modal>
  );
}

// ── Client Card ───────────────────────────────────────────────────────────────
function ClientCard({ client, onEdit, onDelete, onShowUserQr }) {
  const [expanded, setExpanded] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [changePwUser, setChangePwUser] = useState(null);

  const loadUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const data = await adminApi.listUsers(client.id);
      setUsers(data);
    } catch { /* ignore */ }
    setUsersLoading(false);
  }, [client.id]);

  const toggleExpanded = () => {
    if (!expanded) loadUsers();
    setExpanded((v) => !v);
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Delete this user?")) return;
    await adminApi.deleteUser(userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <div className="rounded-2xl border border-ink/10 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 p-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-ink">{client.shop_name}</p>
          <p className="mt-0.5 text-xs text-ink/50">ID: <code className="font-mono">{client.client_uid}</code></p>
          {client.upi_id && <p className="text-xs text-ink/60 mt-0.5">UPI: {client.upi_id}</p>}
          <p className="text-xs text-ink/60 mt-0.5">Rates: B/W Rs {Number(client.bw_price ?? 3)} • Color Rs {Number(client.color_price ?? 10)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => onEdit(client)} className="rounded-lg border border-ink/20 px-3 py-1.5 text-xs font-medium text-ink hover:bg-ink/5">
            Edit
          </button>
          <button onClick={toggleExpanded} className="rounded-lg bg-ink/5 px-3 py-1.5 text-xs font-medium text-ink hover:bg-ink/10">
            {expanded ? "Hide Users" : "Users"}
          </button>
          <button onClick={() => onDelete(client)} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">
            Delete
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-ink/10"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-ink">Desktop Users</p>
                <button
                  onClick={() => setShowCreateUser(true)}
                  className="rounded-lg bg-ink px-3 py-1 text-xs font-medium text-paper"
                >
                  + Add User
                </button>
              </div>
              {usersLoading && <p className="text-xs text-ink/50">Loading...</p>}
              {!usersLoading && users.length === 0 && (
                <p className="text-xs text-ink/50">No users yet. Create one to allow desktop login.</p>
              )}
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between rounded-xl bg-ink/5 px-3 py-2 mb-2">
                  <div>
                    <p className="text-sm font-medium text-ink">{user.username}</p>
                    <p className="text-xs text-ink/50">Upload UID: <code className="font-mono">{user.user_uid}</code></p>
                    <p className="text-xs text-ink/50">Created {new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onShowUserQr({ client, user })}
                      className="rounded-lg border border-ink/20 px-2 py-1 text-xs font-medium text-ink hover:bg-ink/5"
                    >
                      QR
                    </button>
                    <button
                      onClick={() => setChangePwUser(user)}
                      className="rounded-lg border border-ink/20 px-2 py-1 text-xs font-medium text-ink hover:bg-ink/5"
                    >
                      Change Password
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="rounded-lg bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateUser && (
          <CreateUserModal
            clientId={client.id}
            onClose={() => setShowCreateUser(false)}
            onCreated={(user) => {
              setUsers((prev) => [user, ...prev]);
              setShowCreateUser(false);
            }}
          />
        )}
        {changePwUser && (
          <ChangePasswordModal
            user={changePwUser}
            onClose={() => setChangePwUser(null)}
            onChanged={() => setChangePwUser(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [clients, setClients] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsRange, setAnalyticsRange] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [qrTarget, setQrTarget] = useState(null);
  const navigate = useNavigate();

  const loadClients = useCallback(async () => {
    setLoading(true);
    const isLocalSession = Boolean(localStorage.getItem(LOCAL_AUTH_KEY));
    try {
      const [data, analyticsData] = await Promise.all([
        adminApi.listClients(),
        adminApi.getAnalytics(null, analyticsRange)
      ]);
      setClients(data);
      setAnalytics(analyticsData);
    } catch (err) {
      if (!isLocalSession && (err.message?.includes("401") || err.message?.includes("token"))) {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
        navigate("/admin/login");
      }
    }
    setLoading(false);
  }, [navigate, analyticsRange]);

  useEffect(() => { loadClients(); }, [loadClients]);

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
    localStorage.removeItem(LOCAL_AUTH_KEY);
    navigate("/admin/login");
  };

  const handleDelete = async (client) => {
    if (!confirm(`Delete "${client.shop_name}" and all its users? This cannot be undone.`)) return;
    await adminApi.deleteClient(client.id);
    setClients((prev) => prev.filter((c) => c.id !== client.id));
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-ink/10 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div>
            <h1 className="font-display text-xl font-bold text-ink">Print Panda Control Panel</h1>
            <p className="text-xs text-ink/50">Manage shops and users</p>
          </div>
          <button onClick={logout} className="rounded-xl border border-ink/20 px-4 py-2 text-sm font-medium text-ink hover:bg-ink/5">
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Stats bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-2xl font-bold text-ink">{clients.length} Shop{clients.length !== 1 ? "s" : ""}</p>
            <p className="text-sm text-ink/60">Each desktop user has a unique upload URL and isolated queue</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-xl bg-ink px-5 py-2.5 font-semibold text-paper shadow hover:opacity-90"
          >
            + New Shop
          </button>
        </div>

        {analytics && (
          <section className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-ink">Analytics Window</h3>
              <select
                value={analyticsRange}
                onChange={(e) => setAnalyticsRange(e.target.value)}
                className="rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm text-ink"
              >
                <option value="today">Today</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="all">All time</option>
              </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-ink/10 bg-white p-4">
                <p className="text-xs text-ink/55">Total Jobs</p>
                <p className="mt-1 text-2xl font-bold text-ink">{analytics.totalJobs}</p>
              </div>
              <div className="rounded-2xl border border-ink/10 bg-white p-4">
                <p className="text-xs text-ink/55">Printed</p>
                <p className="mt-1 text-2xl font-bold text-ink">{analytics.printedJobs}</p>
              </div>
              <div className="rounded-2xl border border-ink/10 bg-white p-4">
                <p className="text-xs text-ink/55">Failed</p>
                <p className="mt-1 text-2xl font-bold text-ink">{analytics.failedJobs}</p>
              </div>
              <div className="rounded-2xl border border-ink/10 bg-white p-4">
                <p className="text-xs text-ink/55">Revenue (Printed)</p>
                <p className="mt-1 text-2xl font-bold text-ink">Rs {analytics.revenuePrinted}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-ink/10 bg-white p-4">
              <h3 className="font-display text-lg font-semibold text-ink">Recent Print Logs</h3>
              <p className="mt-1 text-xs text-ink/55">Includes shop name with operator user ID, client ID, and desktop credential used for print actions.</p>
              <div className="mt-3 overflow-auto">
                <table className="min-w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-ink/10 text-ink/60">
                      <th className="px-2 py-2">Token</th>
                      <th className="px-2 py-2">Shop (User ID)</th>
                      <th className="px-2 py-2">Client ID</th>
                      <th className="px-2 py-2">Credential</th>
                      <th className="px-2 py-2">Status</th>
                      <th className="px-2 py-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(analytics.recentLogs || []).map((log) => (
                      <tr key={log.id} className="border-b border-ink/5">
                        <td className="px-2 py-2 font-mono">{formatQueueTokenDisplay(log.queue_token, log.id)}</td>
                        <td className="px-2 py-2">{`${log.shop_name || "-"} (${log.printed_by_user_id ? `#${log.printed_by_user_id}` : "-"})`}</td>
                        <td className="px-2 py-2 font-mono">{log.client_uid || "-"}</td>
                        <td className="px-2 py-2 font-mono">{log.printed_by_username || "-"}</td>
                        <td className="px-2 py-2">{String(log.status || "").replace(/_/g, " ")}</td>
                        <td className="px-2 py-2">{log.updated_at ? new Date(log.updated_at).toLocaleString() : "-"}</td>
                      </tr>
                    ))}
                    {(!analytics.recentLogs || analytics.recentLogs.length === 0) && (
                      <tr>
                        <td className="px-2 py-3 text-ink/45" colSpan={6}>No log records yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {loading && (
          <div className="flex py-16 items-center justify-center text-ink/40">Loading...</div>
        )}

        {!loading && clients.length === 0 && (
          <div className="rounded-3xl border-2 border-dashed border-ink/15 py-16 text-center text-ink/40">
            <p className="text-lg font-semibold">No shops yet</p>
            <p className="mt-1 text-sm">Create your first shop to get started</p>
          </div>
        )}

        <div className="space-y-3">
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={setEditClient}
              onDelete={handleDelete}
              onShowUserQr={setQrTarget}
            />
          ))}
        </div>
      </main>

      <AnimatePresence>
        {showCreate && (
          <ClientFormModal
            onClose={() => setShowCreate(false)}
            onSaved={(c) => { setClients((prev) => [c, ...prev]); setShowCreate(false); }}
          />
        )}
        {editClient && (
          <ClientFormModal
            client={editClient}
            onClose={() => setEditClient(null)}
            onSaved={(c) => { setClients((prev) => prev.map((x) => (x.id === c.id ? c : x))); setEditClient(null); }}
          />
        )}
        {qrTarget && (
          <QrModal
            client={qrTarget.client}
            user={qrTarget.user}
            onClose={() => setQrTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
