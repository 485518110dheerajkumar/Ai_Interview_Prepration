const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // temporary storage
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ✅ Get user profile
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password"); // exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    // Normalize null values to empty strings
    res.json({
      _id: user._id,
      name: user.name || "",
      email: user.email || "",
      contact: user.contact || "",
      image: user.image || ""
    });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Update user (contact, password, image)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    let updateData = {
      contact: req.body.contact,
      name: req.body.name
    };

    // Handle password change
    if (req.body.password && req.body.password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }

    // Handle image upload
    if (req.file) {
      const file = fs.readFileSync(req.file.path);
      const encodedImage = `data:${req.file.mimetype};base64,${file.toString("base64")}`;
      updateData.image = encodedImage;
      fs.unlinkSync(req.file.path); // cleanup
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Change password only (separate API if needed)
router.put("/:id/password", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
