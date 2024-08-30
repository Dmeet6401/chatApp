const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./Routes/userRoute"); // Adjust path as necessary
const friendRequestRouter = require('./Routes/friendRequestRoutes'); // Ensure the correct path is used
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Middleware to enable CORS

// Routes
app.use("/api/users", userRouter); // Mount the userRouter at /api/users
app.use("/api/friends", friendRequestRouter); // Mount the friendRequestRouter at /api/friends

// Basic Route
app.get("/", (req, res) => {
  res.send("Welcome to the chat app");
});

// Server setup
const port = process.env.PORT || 5000;
const uri = process.env.ATLAS_URI;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established"))
  .catch((error) => console.log("MongoDB connection failed: ", error.message));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
