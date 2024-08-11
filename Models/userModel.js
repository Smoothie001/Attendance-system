const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: true }, // Exclude password from default responses
  role: { type: String, enum: ['student', 'admin'], default: 'student', required: true },
  registrationNumber: { type: String, unique: true, index: true },
  department: { type: String, trim: true },
  level: { type: String, trim: true, default: "100" },
  passport: { type: String, default: "url-img" } // Consider using a separate image storage system
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
      this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
