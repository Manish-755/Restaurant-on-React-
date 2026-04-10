import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("checking"); // checking | ok | fail

  useEffect(() => {
    const token = sessionStorage.getItem("adminToken");
    if (!token) { setStatus("fail"); return; }

    fetch("/api/admin/verify", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setStatus(data.valid ? "ok" : "fail"))
      .catch(() => setStatus("fail"));
  }, []);

  if (status === "checking") return <div className="page"><p>Checking access...</p></div>;
  if (status === "fail") return <Navigate to="/admin/login" replace />;
  return children;
}