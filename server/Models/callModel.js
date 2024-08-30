const callSchema = new mongoose.Schema({
    caller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    callType: { type: String, enum: ["audio", "video"], required: true },
    duration: { type: Number }, // Duration of the call in seconds
    timestamp: { type: Date, default: Date.now }
  });
  
  const Call = mongoose.model("Call", callSchema);
  
  module.exports = Call;
  