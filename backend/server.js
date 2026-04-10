import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import menuRoutes from "./routes/menu.js";
import teamRoutes from "./routes/team.js";
import contactRoutes from "./routes/contact.js";
import testimonialRoutes from "./routes/testimonials.js";
import reservationRoutes from "./routes/reservations.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors()); // Allow all for simplicity in college project
app.use(express.json());

// ── Auth middleware — import this in route files that need protection ─────────
export function requireAdmin(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorised." });
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token." });
  }
}

// Rate limiting — contact form (10 requests per 15 minutes)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { message: "Too many messages sent. Please try again later." },
});

// Rate limiting — admin login (5 attempts per 10 minutes)
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { message: "Too many login attempts. Please try again later." },
});

app.use("/api/menu",         menuRoutes);
app.use("/api/team",         teamRoutes);
app.use("/api/contact",      contactLimiter, contactRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/admin",        loginLimiter, adminRoutes);

// ── Serving Frontend ───────────────────────────────────────────────────────────
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// Catch-all to serve React's index.html for any unknown routes
app.get("/*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));