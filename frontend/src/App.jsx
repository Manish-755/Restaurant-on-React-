import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import Menu from "./pages/Menu.jsx";
import FAQ from "./pages/FAQ.jsx";
import Contact from "./pages/Contact.jsx";
import Reservations from "./pages/Reservations.jsx";
import CancelBooking from "./pages/CancelBooking.jsx";
import Team from "./pages/Team.jsx";
import Testimonials from "./pages/Testimonials.jsx";

import AdminLogin from "./admin/AdminLogin.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import ProtectedRoute from "./admin/ProtectedRoute.jsx";

function NotFound() {
  return (
    <div className="page">
      <h2>404 - Page Not Found</h2>
      <p>Oops! The page you are looking for does not exist.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />

        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/"            element={<Home />} />
            <Route path="/menu"        element={<Menu />} />
            <Route path="/faq"         element={<FAQ />} />
            <Route path="/contact"     element={<Contact />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/cancel"      element={<CancelBooking />} />
            <Route path="/team"        element={<Team />} />
            <Route path="/testimonials" element={<Testimonials />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}