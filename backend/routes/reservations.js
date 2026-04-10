import express from "express";
import Reservation from "../models/Reservation.js";
import { requireAdmin } from "../server.js";

const router = express.Router();

function generateToken() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let token = "GE-";
  for (let i = 0; i < 6; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
}

// Admin-only: list all reservations
router.get("/", requireAdmin, async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public: look up by token (used by customer cancel page)
router.get("/token/:token", async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ token: req.params.token.toUpperCase() });
    if (!reservation) return res.status(404).json({ message: "No reservation found for this token." });
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Public: create a reservation
router.post("/", async (req, res) => {
  const { name, phone, date, time, guests } = req.body;

  if (!name || !name.trim())
    return res.status(400).json({ message: "Name is required." });
  if (!phone || !/^\d{10}$/.test(phone))
    return res.status(400).json({ message: "Valid 10-digit phone is required." });
  if (!date)
    return res.status(400).json({ message: "Date is required." });
  if (!time)
    return res.status(400).json({ message: "Time is required." });
  if (!guests || guests < 1 || guests > 10)
    return res.status(400).json({ message: "Guests must be between 1 and 10." });

  try {
    let token, exists;
    do {
      token = generateToken();
      exists = await Reservation.findOne({ token });
    } while (exists);

    const reservation = new Reservation({ name: name.trim(), phone, date, time, guests: Number(guests), token });
    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Public: customer cancels using their token
router.delete("/cancel/:token", async (req, res) => {
  try {
    const reservation = await Reservation.findOneAndDelete({ token: req.params.token.toUpperCase() });
    if (!reservation) return res.status(404).json({ message: "No reservation found for this token." });
    res.json({ message: "Reservation cancelled successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin-only: delete by MongoDB ID (from dashboard)
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;