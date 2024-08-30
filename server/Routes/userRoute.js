const express = require("express");
const { 
  registerUser ,
  loginUser, 
  findUser,
  getUser,
} = require("../Controllers/userController");

const router = express.Router();

// Define the route to handle POST requests for user registration
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/find/:userId", findUser);
router.get("/", getUser);

module.exports = router;
