import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem("adminToken", data.token);
        navigate("/admin");
      } else {
        setError(data.message || "Login failed.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-box">
        <div className="admin-login-logo">⚙️</div>
        <h1 className="admin-login-title">Admin Login</h1>
        <p className="admin-login-subtitle">The Grand Eatery — Staff Only</p>

        <form className="admin-login-form" onSubmit={handleLogin}>
          <input
            type="password"
            className="admin-login-input"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
          />
          {error && <p className="admin-login-error">{error}</p>}
          <button type="submit" className="admin-login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}