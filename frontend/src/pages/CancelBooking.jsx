import { useState } from "react";

export default function CancelBooking() {
  const [token, setToken] = useState("");
  const [booking, setBooking] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | found | cancelled | error
  const [message, setMessage] = useState("");

  const handleLookup = async (e) => {
    e.preventDefault();
    const trimmed = token.trim().toUpperCase();
    if (!trimmed) return;

    setStatus("loading");
    setBooking(null);
    setMessage("");

    try {
      const res = await fetch(`/api/reservations/token/${trimmed}`);
      if (res.ok) {
        const data = await res.json();
        setBooking(data);
        setStatus("found");
      } else {
        const err = await res.json();
        setMessage(err.message || "No reservation found for this token.");
        setStatus("error");
      }
    } catch {
      setMessage("Network error. Please try again.");
      setStatus("error");
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;

    setStatus("loading");
    try {
      const res = await fetch(`/api/reservations/cancel/${booking.token}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setStatus("cancelled");
        setBooking(null);
        setToken("");
      } else {
        const err = await res.json();
        setMessage(err.message || "Cancellation failed. Please try again.");
        setStatus("error");
      }
    } catch {
      setMessage("Network error. Please try again.");
      setStatus("error");
    }
  };

  /* ── Cancelled success screen ── */
  if (status === "cancelled") {
    return (
      <div className="page">
        <div className="token-confirm-box">
          <div className="token-confirm-icon">✅</div>
          <h2 className="token-confirm-title">Reservation Cancelled</h2>
          <p className="token-confirm-sub">
            Your reservation has been successfully cancelled. We hope to see you again soon!
          </p>
          <button
            className="token-new-btn"
            onClick={() => { setStatus("idle"); setMessage(""); }}
          >
            Cancel Another Booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Cancel Booking</h1>
      <p>Enter your booking token to look up and cancel your reservation.</p>

      {/* Token lookup form */}
      <form className="form" onSubmit={handleLookup}>
        <input
          type="text"
          placeholder="Enter token (e.g. GE-A3X9K2)"
          value={token}
          onChange={(e) => {
            setToken(e.target.value);
            setStatus("idle");
            setBooking(null);
            setMessage("");
          }}
          style={{ textTransform: "uppercase", letterSpacing: "2px", fontWeight: "600" }}
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Looking up..." : "Find Booking"}
        </button>
      </form>

      {/* Error */}
      {status === "error" && (
        <p className="form-error" style={{ textAlign: "center", marginTop: "12px" }}>
          ❌ {message}
        </p>
      )}

      {/* Found booking details */}
      {status === "found" && booking && (
        <div className="token-confirm-box" style={{ marginTop: "32px" }}>
          <div className="token-confirm-icon">📋</div>
          <h2 className="token-confirm-title">Booking Found</h2>
          <p className="token-confirm-sub">Please confirm this is your reservation before cancelling.</p>

          <div className="token-display">
            <span className="token-label">Token</span>
            <span className="token-value">{booking.token}</span>
          </div>

          <div className="token-details">
            <div className="token-detail-row"><span>Name</span><strong>{booking.name}</strong></div>
            <div className="token-detail-row"><span>Date</span><strong>{booking.date}</strong></div>
            <div className="token-detail-row"><span>Time</span><strong>{booking.time}</strong></div>
            <div className="token-detail-row"><span>Guests</span><strong>{booking.guests}</strong></div>
            <div className="token-detail-row"><span>Phone</span><strong>{booking.phone}</strong></div>
          </div>

          <button className="cancel-confirm-btn" onClick={handleCancel}>
            Cancel This Reservation
          </button>
        </div>
      )}
    </div>
  );
}