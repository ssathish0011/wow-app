const express = require("express");
const router = express.Router();

const {
  getUsers,
  loginUser,
  registerUser,
} = require("../controllers/userController");

// Register API
router.post("/register", registerUser);

// Login API
router.post("/login", loginUser);

// Get all users API (for admin/testing)
router.get("/all", getUsers);

module.exports = router;
