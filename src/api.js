const API_BASE = (import.meta.env.VITE_API_BASE || "https://git-pipeline.metatronhost.in/print-panda").replace(/\/+$/, "");
const ADMIN_TOKEN_KEY = "panda_admin_token";
const LEGACY_ADMIN_TOKEN_KEY = "iprint_admin_token";

export function uploadJobWithProgress({ file, settings, userUid, onProgress }) {
  return new Promise((resolve, reject) => {
    const normalizedUserUid = String(userUid || "").trim();
    if (!normalizedUserUid) {
      reject(new Error("Invalid upload link. Missing user identifier."));
      return;
    }

    const formData = new FormData();
    formData.append("document", file);
    Object.entries(settings).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    const endpoint = `${API_BASE}/api/u/${encodeURIComponent(normalizedUserUid)}/jobs/upload`;

    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }
      const progress = Math.round((event.loaded / event.total) * 100);
      onProgress?.({
        loaded: event.loaded,
        total: event.total,
        progress
      });
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error("Upload succeeded but response parsing failed"));
        }
        return;
      }

      try {
        const payload = JSON.parse(xhr.responseText);
        reject(new Error(payload.error || "Upload failed"));
      } catch {
        reject(new Error("Upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });
}

export function beginDraftUploadWithProgress({ file, userUid, onProgress }) {
  const xhr = new XMLHttpRequest();
  const promise = new Promise((resolve, reject) => {
    const normalizedUserUid = String(userUid || "").trim();
    if (!normalizedUserUid) {
      reject(new Error("Invalid upload link. Missing user identifier."));
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    xhr.open("POST", `${API_BASE}/api/u/${encodeURIComponent(normalizedUserUid)}/jobs/draft-upload`);
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) {
        return;
      }
      onProgress?.({
        loaded: event.loaded,
        total: event.total,
        progress: Math.round((event.loaded / event.total) * 100)
      });
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error("Upload succeeded but response parsing failed"));
        }
        return;
      }

      try {
        const payload = JSON.parse(xhr.responseText);
        reject(new Error(payload.error || "Upload failed"));
      } catch {
        reject(new Error("Upload failed"));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.onabort = () => reject(new Error("Upload cancelled"));
    xhr.send(formData);
  });

  return {
    promise,
    abort: () => xhr.abort()
  };
}

export async function finalizeDraftUpload({ userUid, jobId, settings }) {
  const normalizedUserUid = String(userUid || "").trim();
  if (!normalizedUserUid || !jobId) {
    throw new Error("Invalid draft upload");
  }

  const response = await fetch(
    `${API_BASE}/api/u/${encodeURIComponent(normalizedUserUid)}/jobs/draft-upload/${encodeURIComponent(String(jobId))}/finalize`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings)
    }
  );
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Upload failed");
  }
  return response.json();
}

export async function cancelDraftUpload(userUid, jobId) {
  const normalizedUserUid = String(userUid || "").trim();
  if (!normalizedUserUid || !jobId) {
    return { ok: false };
  }
  const response = await fetch(
    `${API_BASE}/api/u/${encodeURIComponent(normalizedUserUid)}/jobs/draft-upload/${encodeURIComponent(String(jobId))}`,
    { method: "DELETE" }
  );
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Failed to cancel upload");
  }
  return response.json();
}

export async function verifyPayment(jobId, userUid = "") {
  const normalizedJobId = Number(jobId);
  if (!Number.isFinite(normalizedJobId)) {
    throw new Error("Invalid job id for payment verification");
  }

  const normalizedUserUid = String(userUid || "").trim();
  const endpoint = normalizedUserUid
    ? `${API_BASE}/api/u/${encodeURIComponent(normalizedUserUid)}/jobs/${encodeURIComponent(String(normalizedJobId))}/verify-payment`
    : `${API_BASE}/api/jobs/${encodeURIComponent(String(normalizedJobId))}/verify-payment`;

  const response = await fetch(endpoint, {
    method: "POST"
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Payment verification failed");
  }
  return response.json();
}

export async function getUserJobProgress(userUid, jobId) {
  const normalizedUserUid = String(userUid || "").trim();
  const normalizedJobId = Number(jobId);
  if (!normalizedUserUid || !Number.isFinite(normalizedJobId)) {
    throw new Error("Invalid progress lookup");
  }

  const response = await fetch(
    `${API_BASE}/api/u/${encodeURIComponent(normalizedUserUid)}/jobs/${encodeURIComponent(String(normalizedJobId))}/progress`
  );
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Failed to fetch job progress");
  }
  return response.json();
}

export async function getUserUploadDetails(userUid) {
  const normalizedUserUid = String(userUid || "").trim();
  if (!normalizedUserUid) {
    throw new Error("Invalid upload link");
  }

  const response = await fetch(
    `${API_BASE}/api/u/${encodeURIComponent(normalizedUserUid)}/details`
  );
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Failed to fetch shop details");
  }
  return response.json();
}

export async function getPushConfig() {
  const response = await fetch(`${API_BASE}/api/push/config`);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Failed to load notification settings");
  }
  return response.json();
}

export async function savePushSubscription(userUid, subscription, jobId = null) {
  const normalizedUserUid = String(userUid || "").trim();
  if (!normalizedUserUid || !subscription) {
    throw new Error("Invalid notification subscription");
  }
  const response = await fetch(`${API_BASE}/api/u/${encodeURIComponent(normalizedUserUid)}/push-subscriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jobId,
      subscription: subscription.toJSON ? subscription.toJSON() : subscription
    })
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || "Failed to save notification subscription");
  }
  return response.json();
}

// ── Admin API ──────────────────────────────────────────────────────────────

function adminHeaders() {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(LEGACY_ADMIN_TOKEN_KEY);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function adminFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: adminHeaders()
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const adminApi = {
  login: (username, password) =>
    fetch(`${API_BASE}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    }).then(async (res) => {
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Login failed");
      return body;
    }),

  listClients: () => adminFetch("/api/admin/clients"),

  createClient: (data) =>
    adminFetch("/api/admin/clients", { method: "POST", body: JSON.stringify(data) }),

  updateClient: (id, data) =>
    adminFetch(`/api/admin/clients/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  deleteClient: (id) =>
    adminFetch(`/api/admin/clients/${id}`, { method: "DELETE" }),

  listUsers: (clientId) => adminFetch(`/api/admin/clients/${clientId}/users`),

  createUser: (clientId, data) =>
    adminFetch(`/api/admin/clients/${clientId}/users`, { method: "POST", body: JSON.stringify(data) }),

  deleteUser: (userId) =>
    adminFetch(`/api/admin/users/${userId}`, { method: "DELETE" }),

  changeUserPassword: (userId, password) =>
    adminFetch(`/api/admin/users/${userId}/password`, { method: "PATCH", body: JSON.stringify({ password }) }),

  getAnalytics: (clientId = null, range = "all", filters = {}) => {
    const params = new URLSearchParams();
    if (clientId) params.set("clientId", String(clientId));
    if (range) params.set("range", String(range));
    if (filters?.userId) params.set("userId", String(filters.userId));
    if (filters?.date) params.set("date", String(filters.date));
    const suffix = params.toString() ? `?${params.toString()}` : "";
    return adminFetch(`/api/admin/analytics${suffix}`);
  }
};
