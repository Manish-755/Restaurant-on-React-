import { useState, useEffect } from "react";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ text: "", author: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => { setTestimonials(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const validate = () => {
    const e = {};
    if (!form.text.trim())   e.text   = "Please write something.";
    if (!form.author.trim()) e.author = "Name is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: form.text, author: form.author }),
      });
      if (res.ok) {
        const newT = await res.json();
        setTestimonials((prev) => [...prev, newT]);
        setForm({ text: "", author: "" });
        setErrors({});
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
    finally { setSubmitting(false); }
  };

  if (loading) return <div className="page"><p>Loading...</p></div>;

  return (
    <div className="tpage">

      {/* Header */}
      <div className="tpage-header">
        <h1>What Our Guests Say</h1>
        <p>Real experiences from real people who dined with us.</p>
        <div className="tpage-divider" />
      </div>

      {/* Cards grid */}
      {testimonials.length === 0 ? (
        <p className="tpage-empty">No testimonials yet. Be the first!</p>
      ) : (
        <div className="tgrid">
          {testimonials.map((t, i) => (
            <div className="tcard" key={t._id || i}>
              <span className="tcard-quote">"</span>
              <p className="tcard-text">{t.text}</p>
              <p className="tcard-author">— {t.author}</p>
            </div>
          ))}
        </div>
      )}

      {/* Submit form */}
      <div className="tform-wrap">
        <h2>Share Your Experience</h2>
        <p>Enjoyed dining with us? We'd love to hear from you.</p>

        {submitted && (
          <div className="tform-success">✅ Thank you! Your review has been submitted.</div>
        )}

        <form className="tform" onSubmit={handleSubmit}>
          <textarea
            placeholder="Write your review..."
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
          />
          {errors.text && <p className="form-error">{errors.text}</p>}

          <input
            type="text"
            placeholder="Your name"
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />
          {errors.author && <p className="form-error">{errors.author}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>

    </div>
  );
}