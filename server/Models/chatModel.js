const chatSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }], // Two participants in the chat
    messages: [
      {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
      }
    ],
    createdAt: { type: Date, default: Date.now }
  });
  
  const Chat = mongoose.model("Chat", chatSchema);
  
  module.exports = Chat;
  