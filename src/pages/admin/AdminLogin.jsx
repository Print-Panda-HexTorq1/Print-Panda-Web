import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { adminApi } from "../../api";

const ADMIN_TOKEN_KEY = "panda_admin_token";
const LEGACY_ADMIN_TOKEN_KEY = "iprint_admin_token";

export default function AdminLogin() {
  const navigate = useNavigate();

  // ── Login state ──
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (!loginUser.trim() || !loginPass) {
      setLoginError("Username and password are required.");
      return;
    }

    try {
      setLoginLoading(true);
      const { token } = await adminApi.login(loginUser.trim(), loginPass);
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
      localStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
      localStorage.removeItem("panda_local_auth");
      navigate("/admin");
    } catch (err) {
      setLoginError(err.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Card */}
        <div className="rounded-3xl border border-ink/15 bg-white p-8 shadow-xl">
          <h1 className="font-display text-3xl font-bold text-ink">Print Panda</h1>
          <p className="mt-1 text-sm text-ink/55">Control Panel</p>
          <p className="mt-4 rounded-xl bg-ink/5 px-3 py-2 text-xs text-ink/60">
            Super admin access only. Shop users must sign in through the desktop app.
          </p>
          <motion.form
            key="login"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleLogin}
            className="mt-5 space-y-4"
          >
            <label className="block text-sm font-medium text-ink">
              Username
              <input
                className="mt-1 w-full rounded-xl border border-ink/20 px-3 py-2 text-sm outline-none focus:border-ink/60"
                type="text"
                autoComplete="username"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
              />
            </label>
            <label className="block text-sm font-medium text-ink">
              Password
              <input
                className="mt-1 w-full rounded-xl border border-ink/20 px-3 py-2 text-sm outline-none focus:border-ink/60"
                type="password"
                autoComplete="current-password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
              />
            </label>

            {loginError && (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{loginError}</p>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full rounded-xl bg-ink py-2.5 font-semibold text-paper disabled:opacity-50"
            >
              {loginLoading ? "Signing in..." : "Sign In"}
            </button>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}
