import { useState } from "react";
import { apiRequest } from "../api.js";

function readError(data) {
  if (!data || typeof data !== "object") return "Something went wrong.";
  if (data.detail) return String(data.detail);
  return Object.entries(data)
    .map(([field, messages]) => `${field}: ${[].concat(messages).join(" ")}`)
    .join(" | ");
}

// Same rules as the backend: 8+ characters with lowercase, uppercase, a number and a special character.
function passwordProblems(password) {
  const missing = [];
  if (password.length < 8) missing.push("at least 8 characters");
  if (!/[a-z]/.test(password)) missing.push("a lowercase letter");
  if (!/[A-Z]/.test(password)) missing.push("an uppercase letter");
  if (!/[0-9]/.test(password)) missing.push("a number");
  if (!/[^A-Za-z0-9\s]/.test(password)) missing.push("a special character");
  return missing;
}

export default function AuthForm({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (mode === "register") {
      const missing = passwordProblems(password);
      if (missing.length) {
        setError(`Password needs ${missing.join(", ")}.`);
        return;
      }
    }
    setBusy(true);
    try {
      const payload = mode === "register" ? { username, email, password } : { username, password };
      const res = await apiRequest(null, `auth/${mode}/`, "POST", payload);
      const data = await res.json();
      if (!res.ok) {
        setError(readError(data));
        return;
      }
      onAuth(data.token, username);
    } catch {
      setError("Cannot reach the server. Is the backend running?");
    } finally {
      setBusy(false);
    }
  };

  const isLogin = mode === "login";

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={submit}>
        <div className="brand brand--center">
          <div className="brand__logo">W</div>
          <span className="brand__name">WorkFlowHub</span>
        </div>
        <h1 className="auth__title">{isLogin ? "Welcome back" : "Create your account"}</h1>

        <label className="field">
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        {!isLogin && (
          <label className="field">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
        )}
        <label className="field">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isLogin ? "current-password" : "new-password"}
            required
          />
          {!isLogin && (
            <span className="field__hint">
              At least 8 characters, with a lowercase letter, an uppercase letter, a number and a
              special character.
            </span>
          )}
        </label>

        {error && (
          <div className="banner" role="alert">
            {error}
          </div>
        )}

        <button type="submit" className="btn btn--primary btn--block" disabled={busy}>
          {busy ? "Please wait..." : isLogin ? "Log in" : "Register"}
        </button>

        <p className="auth__switch">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <button
            type="button"
            className="link"
            onClick={() => {
              setMode(isLogin ? "register" : "login");
              setError("");
            }}
          >
            {isLogin ? "Create an account" : "Log in"}
          </button>
        </p>
      </form>
    </div>
  );
}