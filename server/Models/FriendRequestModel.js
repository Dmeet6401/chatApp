const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who sends the request
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who receives the request
    status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
    // createdAt: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
  });
  
  const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);
  
  module.exports = FriendRequest;
  