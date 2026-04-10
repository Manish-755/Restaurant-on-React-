import { useState } from "react";

export default function Reservations() {
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    name: "", phone: "", date: "", time: "", guests: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    const guestsNum = Number(formData.guests);

    if (!formData.name.trim())            newErrors.name   = "Name is required";
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone  = "Enter valid 10-digit phone number";
    if (!formData.date)                   newErrors.date   = "Select a date";
    else if (formData.date < today)       newErrors.date   = "Please select a future date";
    if (!formData.time)                   newErrors.time   = "Select a time";
    if (!formData.guests || isNaN(guestsNum) || guestsNum < 1)
                                          newErrors.guests = "Enter number of guests";
    else if (guestsNum > 10)              newErrors.guests = "Maximum 10 guests allowed";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, guests: Number(formData.guests) }),
      });

      if (res.ok) {
        const data = await res.json();
        setBooking(data);
        setFormData({ name: "", phone: "", date: "", time: "", guests: "" });
        setErrors({});
      } else {
        const err = await res.json();
        alert(err.message || "Booking failed. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(booking.token).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  /* ── Token confirmation screen ── */
  if (booking) {
    return (
      <div className="page">
        <div className="token-confirm-box">
          <div className="token-confirm-icon">🎉</div>
          <h2 className="token-confirm-title">Table Booked!</h2>
          <p className="token-confirm-sub">
            Your reservation is confirmed. Save your token — you'll need it to cancel.
          </p>

          <div className="token-display">
            <span className="token-label">Your Booking Token</span>
            <span className="token-value">{booking.token}</span>
            <button className="token-copy-btn" onClick={handleCopy}>
              {copied ? "✅ Copied!" : "📋 Copy"}
            </button>
          </div>

          <div className="token-details">
            <div className="token-detail-row"><span>Name</span><strong>{booking.name}</strong></div>
            <div className="token-detail-row"><span>Date</span><strong>{booking.date}</strong></div>
            <div className="token-detail-row"><span>Time</span><strong>{booking.time}</strong></div>
            <div className="token-detail-row"><span>Guests</span><strong>{booking.guests}</strong></div>
            <div className="token-detail-row"><span>Phone</span><strong>{booking.phone}</strong></div>
          </div>

          <p className="token-note">
            📌 Show this token at the restaurant. To cancel, visit the{" "}
            <a href="/cancel">Cancel Booking</a> page.
          </p>

          <button className="token-new-btn" onClick={() => { setBooking(null); setCopied(false); }}>
            + Make Another Booking
          </button>
        </div>
      </div>
    );
  }

  /* ── Booking form ── */
  return (
    <div className="page">
      <h1>Reservations</h1>
      <p>Fill in your details to book a table.</p>

      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text" name="name" placeholder="Name"
          value={formData.name} onChange={handleChange}
        />
        {errors.name && <p className="form-error">{errors.name}</p>}

        <input
          type="tel" name="phone" placeholder="Phone"
          value={formData.phone} onChange={handleChange}
        />
        {errors.phone && <p className="form-error">{errors.phone}</p>}

        <input
          type="date" name="date" min={today}
          value={formData.date} onChange={handleChange}
        />
        {errors.date && <p className="form-error">{errors.date}</p>}

        <input
          type="time" name="time"
          value={formData.time} onChange={handleChange}
        />
        {errors.time && <p className="form-error">{errors.time}</p>}

        <input
          type="number" name="guests" placeholder="Number of Guests" min="1" max="10"
          value={formData.guests} onChange={handleChange}
        />
        {errors.guests && <p className="form-error">{errors.guests}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Booking..." : "Book Table"}
        </button>
      </form>
    </div>
  );
}