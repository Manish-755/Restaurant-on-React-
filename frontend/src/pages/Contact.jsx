import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Valid email required";
    if (!formData.message.trim()) newErrors.message = "Message cannot be empty";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <h1>Contact Us</h1>

      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text" name="name" placeholder="Your Name"
          value={formData.name} onChange={handleChange}
        />
        {errors.name && <p className="form-error">{errors.name}</p>}

        <input
          type="email" name="email" placeholder="Your Email"
          value={formData.email} onChange={handleChange}
        />
        {errors.email && <p className="form-error">{errors.email}</p>}

        <textarea
          name="message" placeholder="Your Message"
          value={formData.message} onChange={handleChange}
        />
        {errors.message && <p className="form-error">{errors.message}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}