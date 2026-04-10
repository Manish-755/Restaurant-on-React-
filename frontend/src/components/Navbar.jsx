import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu whenever route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navClass = ({ isActive }) => (isActive ? "active" : "");

  return (
    <nav className="navbar">
      <h2 className="logo">The Grand Eatery</h2>

      <button
        className="hamburger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle navigation"
      >
        {isOpen ? "✕" : "☰"}
      </button>

      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        <NavLink to="/"             className={navClass}>Home</NavLink>
        <NavLink to="/menu"         className={navClass}>Menu</NavLink>
        <NavLink to="/team"         className={navClass}>Team</NavLink>
        <NavLink to="/faq"          className={navClass}>FAQ</NavLink>
        <NavLink to="/contact"      className={navClass}>Contact</NavLink>
        <NavLink to="/reservations" className={navClass}>Reservations</NavLink>
        <NavLink to="/cancel"       className={navClass}>Cancel Booking</NavLink>
        <NavLink to="/testimonials" className={navClass}>Testimonials</NavLink>
      </div>
    </nav>
  );
}