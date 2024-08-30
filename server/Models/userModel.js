const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, minlength: 3, maxlength: 20 },
  lastName: { type: String, required: true, minlength: 3, maxlength: 20 },
  dob: { type: Date, required: true }, // Date of Birth
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true }, // User-provided or auto-generated
  password: { type: String, required: true, minlength: 8, unique: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // List of friends
  otp: { type: String }, // OTP for registration
  otpExpires: { type: Date }, // OTP expiration time
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Middleware to auto-generate the username before saving
userSchema.pre('save', function (next) {
  if (!this.username) {
    const firstTwoLetters = this.firstName.slice(0, 2).toLowerCase(); // Get first two letters of the first name
    const dobString = this.dob.toISOString().split('T')[0].replace(/-/g, ''); // Format DOB as YYYYMMDD
    this.username = `${firstTwoLetters}${dobString}`; // Concatenate to form the default username
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
