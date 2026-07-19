import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { adminApi } from "../../api";

const ADMIN_TOKEN_KEY = "panda_admin_token";
const LEGACY_ADMIN_TOKEN_KEY = "iprint_admin_token";
const LOCAL_AUTH_KEY = "panda_local_auth";
const LOCAL_ACCOUNTS_KEY = "panda_local_accounts";

function getLocalAccounts() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_ACCOUNTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLocalAccount(username, password) {
  const accounts = getLocalAccounts().filter((a) => a.username !== username);
  accounts.push({ username, password });
  localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
}

function checkLocalAccount(username, password) {
  return getLocalAccounts().some(
    (a) => a.username === username && a.password === password
  );
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get("signup") === "1" ? "signup" : "login");

  // ── Login state ──
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // ── Signup state ──
  const [signupUser, setSignupUser] = useState("");
  const [signupPass, setSignupPass] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (!loginUser.trim() || !loginPass) {
      setLoginError("Username and password are required.");
      return;
    }

    // 1. Check local accounts first
    if (checkLocalAccount(loginUser.trim(), loginPass)) {
      localStorage.setItem(LOCAL_AUTH_KEY, loginUser.trim());
      navigate("/admin");
      return;
    }

    // 2. Fall back to server login
    try {
      setLoginLoading(true);
      const { token } = await adminApi.login(loginUser.trim(), loginPass);
      localStorage.setItem(ADMIN_TOKEN_KEY, token);
      localStorage.removeItem(LEGACY_ADMIN_TOKEN_KEY);
      navigate("/admin");
    } catch (err) {
      setLoginError(err.message || "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setSignupError("");
    setSignupSuccess("");

    if (!signupUser.trim()) { setSignupError("Username is required."); return; }
    if (signupUser.trim().length < 3) { setSignupError("Username must be at least 3 characters."); return; }
    if (signupPass.length < 4) { setSignupError("Password must be at least 4 characters."); return; }
    if (signupPass !== signupConfirm) { setSignupError("Passwords do not match."); return; }

    const existing = getLocalAccounts().find((a) => a.username === signupUser.trim());
    if (existing) { setSignupError("That username is already taken. Choose another."); return; }

    setSignupLoading(true);
    saveLocalAccount(signupUser.trim(), signupPass);
    setSignupLoading(false);
    setSignupSuccess(`Account "${signupUser.trim()}" created! You can now log in.`);
    setSignupUser("");
    setSignupPass("");
    setSignupConfirm("");

    // Auto-switch to login after 1.2s
    setTimeout(() => { setMode("login"); setSignupSuccess(""); }, 1200);
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

          {/* Mode tabs */}
          <div className="mt-5 flex rounded-xl border border-ink/12 bg-ink/5 p-1 gap-1">
            {["login", "signup"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setLoginError(""); setSignupError(""); setSignupSuccess(""); }}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                  mode === m
                    ? "bg-white text-ink shadow-sm"
                    : "text-ink/50 hover:text-ink/70"
                }`}
              >
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* ── LOGIN ── */}
            {mode === "login" && (
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
            )}

            {/* ── SIGNUP ── */}
            {mode === "signup" && (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSignup}
                className="mt-5 space-y-4"
              >
                <label className="block text-sm font-medium text-ink">
                  Username
                  <input
                    className="mt-1 w-full rounded-xl border border-ink/20 px-3 py-2 text-sm outline-none focus:border-ink/60"
                    type="text"
                    autoComplete="username"
                    value={signupUser}
                    onChange={(e) => setSignupUser(e.target.value)}
                  />
                </label>
                <label className="block text-sm font-medium text-ink">
                  Password
                  <input
                    className="mt-1 w-full rounded-xl border border-ink/20 px-3 py-2 text-sm outline-none focus:border-ink/60"
                    type="password"
                    autoComplete="new-password"
                    value={signupPass}
                    onChange={(e) => setSignupPass(e.target.value)}
                  />
                </label>
                <label className="block text-sm font-medium text-ink">
                  Confirm Password
                  <input
                    className="mt-1 w-full rounded-xl border border-ink/20 px-3 py-2 text-sm outline-none focus:border-ink/60"
                    type="password"
                    autoComplete="new-password"
                    value={signupConfirm}
                    onChange={(e) => setSignupConfirm(e.target.value)}
                  />
                </label>

                {signupError && (
                  <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{signupError}</p>
                )}
                {signupSuccess && (
                  <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{signupSuccess}</p>
                )}

                <button
                  type="submit"
                  disabled={signupLoading}
                  className="w-full rounded-xl bg-mint py-2.5 font-semibold text-ink disabled:opacity-50"
                >
                  {signupLoading ? "Creating..." : "Create Account"}
                </button>

                <p className="text-center text-xs text-ink/40">
                  Account is stored locally on this device only.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
