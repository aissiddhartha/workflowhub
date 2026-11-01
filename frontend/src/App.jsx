import { useCallback, useEffect, useState } from "react";
import AuthForm from "./components/AuthForm.jsx";
import Board from "./components/Board.jsx";
import UserMenu from "./components/UserMenu.jsx";
import { apiRequest } from "./api.js";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const clearSession = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUsername("");
    setItems([]);
  }, []);

  // Every call goes through here so an expired token logs the user out cleanly.
  const api = useCallback(
    async (path, method, body) => {
      const res = await apiRequest(token, path, method, body);
      if (res.status === 401) clearSession();
      return res;
    },
    [token, clearSession]
  );

  // The "task moved" message disappears by itself after three seconds.
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const loadItems = useCallback(async () => {
    try {
      const res = await api("workflow-items/");
      if (res.ok) {
        setItems(await res.json());
        setError("");
      } else if (res.status !== 401) {
        setError("Could not load your tasks.");
      }
    } catch {
      setError("Cannot reach the server. Is the backend running?");
    }
  }, [api]);

  useEffect(() => {
    if (token) loadItems();
  }, [token, loadItems]);

  const handleAuth = (newToken, name) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("username", name);
    setToken(newToken);
    setUsername(name);
  };

  const logout = async () => {
    try {
      await api("auth/logout/", "POST");
    } catch {
      // The session is cleared locally even if the server cannot be reached.
    }
    clearSession();
  };

  const createItem = async (data) => {
    try {
      const res = await api("workflow-items/", "POST", data);
      if (!res.ok) throw new Error("create failed");
      const created = await res.json();
      setItems((prev) => [created, ...prev]);
      setError("");
    } catch {
      setError("Could not create the task.");
    }
  };

  // Updates the card straight away, then saves; reverts if the server refuses.
  const updateItem = async (id, changes) => {
    const previous = items;
    const before = items.find((item) => item.id === id);
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...changes } : item)));
    try {
      const res = await api(`workflow-items/${id}/`, "PATCH", changes);
      if (!res.ok) throw new Error("update failed");
      const saved = await res.json();
      setItems((prev) => prev.map((item) => (item.id === id ? saved : item)));
      setError("");
      if (before && saved.status !== before.status) {
        setToast({ text: `"${saved.title}" is moved to ${saved.status}.` });
      }
    } catch {
      setItems(previous);
      setError("Could not save that change, so it was reverted.");
    }
  };

  const moveItem = (id, status) => {
    const item = items.find((i) => i.id === id);
    if (item && item.status !== status) updateItem(id, { status });
  };

  const deleteItem = async (id) => {
    try {
      const res = await api(`workflow-items/${id}/`, "DELETE");
      if (!res.ok) throw new Error("delete failed");
      setItems((prev) => prev.filter((item) => item.id !== id));
      setError("");
    } catch {
      setError("Could not delete the task.");
    }
  };

  if (!token) return <AuthForm onAuth={handleAuth} />;

  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1 className="app__title">WorkFlowHub Sprint Board</h1>
          <p className="app__sub">Drag a card to another column to change its status.</p>
        </div>
        <UserMenu username={username} onLogout={logout} />
      </header>

      <div className="window">
        <div className="window__bar">
          <div className="dots" aria-hidden="true">
            <span className="dot dot--red" />
            <span className="dot dot--yellow" />
            <span className="dot dot--green" />
          </div>
        </div>

        <div className="window__body">
          {error && (
            <div className="banner" role="alert">
              {error}
            </div>
          )}
          <Board
            items={items}
            onCreate={createItem}
            onMove={moveItem}
            onUpdate={updateItem}
            onDelete={deleteItem}
          />
        </div>
      </div>

      {toast && (
        <div className="toast" role="status">
          {toast.text}
        </div>
      )}
    </div>
  );
}