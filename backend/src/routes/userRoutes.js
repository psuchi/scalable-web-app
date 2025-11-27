import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import { User } from "../models/User.js";

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  res.json(req.user);
});

router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name },
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
