import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MENU_CATEGORIES = ["Appetizers", "Main Course", "Desserts", "Drinks"];

// Auth-aware API helper — always sends the stored admin token
const getToken = () => sessionStorage.getItem("adminToken");

const API = {
  get: (url) =>
    fetch(url, { headers: { Authorization: `Bearer ${getToken()}` } }).then((r) => r.json()),
  post: (url, body) =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(body),
    }).then((r) => r.json()),
  put: (url, body) =>
    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(body),
    }).then((r) => r.json()),
  delete: (url) =>
    fetch(url, { method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` } }).then((r) =>
      r.json()
    ),
};

/* ══════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                            */
/* ══════════════════════════════════════════════════════════ */

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const navItems = [
    { key: "overview", label: "Overview", icon: "🏠" },
    { key: "messages", label: "Messages", icon: "✉️" },
    { key: "menu", label: "Menu", icon: "🍽️" },
    { key: "team", label: "Team", icon: "👥" },
    { key: "testimonials", label: "Testimonials", icon: "💬" },
    { key: "reservations", label: "Reservations", icon: "📋" },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="admin-sidebar-icon">⚙️</span>
          <span className="admin-sidebar-name">Grand Eatery</span>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`admin-nav-item ${activeSection === item.key ? "admin-nav-active" : ""}`}
              onClick={() => setActiveSection(item.key)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button className="admin-logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <h2 className="admin-topbar-title">
            {navItems.find((n) => n.key === activeSection)?.icon}{" "}
            {navItems.find((n) => n.key === activeSection)?.label}
          </h2>
          <span className="admin-topbar-badge">Admin</span>
        </header>

        <div className="admin-content">
          {activeSection === "overview" && <Overview setSection={setActiveSection} />}
          {activeSection === "menu" && <MenuSection />}
          {activeSection === "team" && <TeamSection />}
          {activeSection === "messages" && <MessagesSection />}
          {activeSection === "testimonials" && <TestimonialsSection />}
          {activeSection === "reservations" && <ReservationsSection />}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  OVERVIEW                                                  */
/* ══════════════════════════════════════════════════════════ */

function Overview({ setSection }) {
  const [counts, setCounts] = useState({ menu: 0, team: 0, messages: 0, testimonials: 0, reservations: 0 });

  useEffect(() => {
    Promise.all([
      API.get("/api/menu"),
      API.get("/api/team"),
      API.get("/api/contact"),
      API.get("/api/testimonials"),
      API.get("/api/reservations"),
    ]).then(([menu, team, contacts, testimonials, reservations]) => {
      setCounts({
        menu: Array.isArray(menu) ? menu.length : 0,
        team: Array.isArray(team) ? team.length : 0,
        messages: Array.isArray(contacts) ? contacts.length : 0,
        testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
        reservations: Array.isArray(reservations) ? reservations.length : 0,
      });
    }).catch(() => { });
  }, []);

  const cards = [
    { key: "menu", icon: "🍽️", label: "Menu Items", count: counts.menu },
    { key: "team", icon: "👥", label: "Team Members", count: counts.team },
    { key: "messages", icon: "✉️", label: "Messages", count: counts.messages },
    { key: "testimonials", icon: "💬", label: "Testimonials", count: counts.testimonials },
    { key: "reservations", icon: "📋", label: "Reservations", count: counts.reservations },
  ];

  return (
    <div>
      <p className="admin-overview-welcome">Welcome back! Here's a quick overview of your restaurant.</p>
      <div className="admin-overview-grid">
        {cards.map((c) => (
          <button key={c.key} className="admin-stat-card" onClick={() => setSection(c.key)}>
            <span className="admin-stat-icon">{c.icon}</span>
            <span className="admin-stat-count">{c.count}</span>
            <span className="admin-stat-label">{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  MENU SECTION                                              */
/* ══════════════════════════════════════════════════════════ */

function MenuSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [editItem, setEditItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", category: "Appetizers", veg: true, img: "" });
  const [error, setError] = useState("");

  const load = () => {
    API.get("/api/menu").then((data) => { setItems(data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const categories = ["All", ...MENU_CATEGORIES];
  const filtered = filter === "All" ? items : items.filter((i) => i.category === filter);

  const openAdd = () => {
    setEditItem(null);
    setForm({ name: "", price: "", category: "Appetizers", veg: true, img: "" });
    setError("");
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ name: item.name, price: item.price, category: item.category, veg: item.veg, img: item.img || "" });
    setError("");
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this menu item?")) return;
    await API.delete(`/api/menu/${id}`);
    load();
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Name is required."); return; }
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) { setError("Enter a valid price."); return; }

    const body = { ...form, price: Number(form.price) };
    if (editItem) await API.put(`/api/menu/${editItem._id}`, body);
    else await API.post("/api/menu", body);

    setShowForm(false);
    load();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="admin-section-toolbar">
        <div className="admin-filter-row">
          {categories.map((c) => (
            <button
              key={c}
              className={`admin-filter-btn ${filter === c ? "admin-filter-active" : ""}`}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <button className="admin-add-btn" onClick={openAdd}>+ Add Item</button>
      </div>

      {showForm && (
        <div className="admin-modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">{editItem ? "Edit Menu Item" : "Add Menu Item"}</h3>

            <label className="admin-label">Name</label>
            <input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Item name" />

            <label className="admin-label">Price (₹)</label>
            <input className="admin-input" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" />

            <label className="admin-label">Category</label>
            <select className="admin-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {MENU_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>

            <label className="admin-label">Image URL (optional)</label>
            <input className="admin-input" value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} placeholder="https://..." />

            <label className="admin-label">Type</label>
            <div className="admin-radio-row">
              <label className="admin-radio"><input type="radio" checked={form.veg} onChange={() => setForm({ ...form, veg: true })} /> Veg</label>
              <label className="admin-radio"><input type="radio" checked={!form.veg} onChange={() => setForm({ ...form, veg: false })} /> Non-Veg</label>
            </div>

            {error && <p className="admin-form-error">{error}</p>}

            <div className="admin-modal-actions">
              <button className="admin-btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="admin-btn-primary" onClick={handleSave}>{editItem ? "Update" : "Add"}</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Category</th><th>Price</th><th>Type</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>₹{item.price}</td>
                <td>
                  <span className={`admin-badge ${item.veg ? "admin-badge-veg" : "admin-badge-nonveg"}`}>
                    {item.veg ? "VEG" : "NON-VEG"}
                  </span>
                </td>
                <td className="admin-action-cell">
                  <button className="admin-edit-btn" onClick={() => openEdit(item)}>Edit</button>
                  <button className="admin-delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  TEAM SECTION                                              */
/* ══════════════════════════════════════════════════════════ */

function TeamSection() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", role: "", img: "" });
  const [error, setError] = useState("");

  const load = () => {
    API.get("/api/team").then((data) => { setMembers(data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditItem(null); setForm({ name: "", role: "", img: "" }); setError(""); setShowForm(true); };
  const openEdit = (m) => { setEditItem(m); setForm({ name: m.name, role: m.role, img: m.img || "" }); setError(""); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this team member?")) return;
    await API.delete(`/api/team/${id}`);
    load();
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Name is required."); return; }
    if (!form.role.trim()) { setError("Role is required."); return; }
    if (editItem) await API.put(`/api/team/${editItem._id}`, form);
    else await API.post("/api/team", form);
    setShowForm(false);
    load();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="admin-section-toolbar">
        <span />
        <button className="admin-add-btn" onClick={openAdd}>+ Add Member</button>
      </div>

      {showForm && (
        <div className="admin-modal-backdrop" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="admin-modal-title">{editItem ? "Edit Member" : "Add Member"}</h3>

            <label className="admin-label">Name</label>
            <input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />

            <label className="admin-label">Role</label>
            <input className="admin-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Head Chef" />

            <label className="admin-label">Image URL (optional)</label>
            <input className="admin-input" value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} placeholder="https://..." />

            {error && <p className="admin-form-error">{error}</p>}

            <div className="admin-modal-actions">
              <button className="admin-btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="admin-btn-primary" onClick={handleSave}>{editItem ? "Update" : "Add"}</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>#</th><th>Name</th><th>Role</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={m._id}>
                <td>{i + 1}</td>
                <td>{m.name}</td>
                <td>{m.role}</td>
                <td className="admin-action-cell">
                  <button className="admin-edit-btn" onClick={() => openEdit(m)}>Edit</button>
                  <button className="admin-delete-btn" onClick={() => handleDelete(m._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  TESTIMONIALS SECTION                                      */
/* ══════════════════════════════════════════════════════════ */

function TestimonialsSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    API.get("/api/testimonials").then((data) => { setItems(data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    await API.delete(`/api/testimonials/${id}`);
    load();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="admin-cards-grid">
        {items.map((t) => (
          <div key={t._id} className="admin-info-card">
            <div className="admin-info-card-body">
              <p className="admin-info-card-desc">"{t.text}"</p>
              <p className="admin-info-card-meta">— {t.author}</p>
            </div>
            <div className="admin-info-card-actions">
              <button className="admin-delete-btn" onClick={() => handleDelete(t._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  RESERVATIONS SECTION                                      */
/* ══════════════════════════════════════════════════════════ */

function ReservationsSection() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    API.get("/api/reservations").then((data) => { setReservations(data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this reservation?")) return;
    await API.delete(`/api/reservations/${id}`);
    load();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <p className="admin-section-note">
        {reservations.length} reservation{reservations.length !== 1 ? "s" : ""} found.
      </p>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>#</th><th>Token</th><th>Name</th><th>Phone</th><th>Date</th><th>Time</th><th>Guests</th><th>Action</th></tr>
          </thead>
          <tbody>
            {reservations.map((r, i) => (
              <tr key={r._id}>
                <td>{i + 1}</td>
                <td><span className="admin-token-badge">{r.token}</span></td>
                <td>{r.name}</td>
                <td>{r.phone}</td>
                <td>{r.date}</td>
                <td>{r.time}</td>
                <td>{r.guests}</td>
                <td>
                  <button className="admin-delete-btn" onClick={() => handleDelete(r._id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  MESSAGES SECTION                                          */
/* ══════════════════════════════════════════════════════════ */

function MessagesSection() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/contact").then((data) => { setMessages(data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    await API.delete(`/api/contact/${id}`);

    // remove from UI
    setMessages((prev) => prev.filter((m) => m._id !== id));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <p className="admin-section-note">
        {messages.length} message{messages.length !== 1 ? "s" : ""} received.
      </p>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>#</th><th>Name</th><th>Email</th><th>Message</th><th>Date</th><th>Action</th></tr>
          </thead>
          <tbody>
            {messages.map((m, i) => (
              <tr key={m._id}>
                <td>{i + 1}</td>
                <td>{m.name}</td>
                <td>{m.email}</td>
                <td style={{ maxWidth: "300px" }}>{m.message}</td>
                <td>{new Date(m.createdAt).toLocaleDateString()}</td>

                <td>
                  <button
                    className="admin-delete-btn"
                    onClick={() => handleDelete(m._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}