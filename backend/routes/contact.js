import express from "express";
import Contact from "../models/Contact.js";
import { requireAdmin } from "../server.js";

const router = express.Router();

// Public: submit a contact message
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !name.trim())
    return res.status(400).json({ message: "Name is required." });
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return res.status(400).json({ message: "Valid email is required." });
  if (!message || !message.trim())
    return res.status(400).json({ message: "Message is required." });
  if (message.trim().length > 1000)
    return res.status(400).json({ message: "Message too long (max 1000 chars)." });

  try {
    const contact = new Contact({ name: name.trim(), email: email.trim(), message: message.trim() });
    await contact.save();
    res.status(201).json({ message: "Message sent successfully." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin-only: read all messages
router.get("/", requireAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin-only: delete a message
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;