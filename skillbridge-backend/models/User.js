// models/User.js — User schema (students AND employers share this model)
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    // ── Core ──────────────────────────────────────────────────────
    name: {
      type:      String,
      required:  [true, 'Name is required'],
      trim:      true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type:     String,
      required: [true, 'Email is required'],
      unique:   true,
      lowercase: true,
      trim:     true,
      match:    [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
      type:      String,
      minlength: [6, 'Password must be at least 6 characters'],
      select:    false  // Never return password in queries by default
    },
    googleId: {
      type:   String,
      unique: true,
      sparse: true  // Allows multiple null values
    },

    // ── Role ──────────────────────────────────────────────────────
    role: {
      type:    String,
      enum:    ['student', 'employer', 'admin'],
      default: 'student'
    },

    // ── Profile info ──────────────────────────────────────────────
    avatar:       { type: String, default: '' },
    university:   { type: String, default: '' },
    bio:          { type: String, default: '', maxlength: [500, 'Bio cannot exceed 500 characters'] },
    skills:       [{ type: String, trim: true }],
    rate:         { type: String, default: '' },         // e.g. "£35/hr"
    rateValue:    { type: Number, default: 0 },          // numeric for filtering
    category:     { type: String, default: '' },
    workType:     { type: String, enum: ['remote', 'hybrid', 'onsite', ''], default: '' },
    isAvailable:  { type: Boolean, default: true },
    isVerified:   { type: Boolean, default: false },
    linkedinUrl:  { type: String, default: '' },
    portfolioUrl: { type: String, default: '' },

    // ── Stats ─────────────────────────────────────────────────────
    rating:       { type: Number, default: 0, min: 0, max: 5 },
    reviewCount:  { type: Number, default: 0 },
    projectsDone: { type: Number, default: 0 },

    // ── Purchases (guide keys the user owns) ──────────────────────
    purchases: [{ type: String }]  // e.g. ['guide-cv-optimization']
  },
  { timestamps: true }
);

// ── Hash password before saving ───────────────────────────────────
UserSchema.pre('save', async function (next) {
  // Only hash if password was actually changed
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method: compare entered password with hashed ─────────
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
