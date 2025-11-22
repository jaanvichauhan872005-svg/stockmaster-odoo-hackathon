const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
  tokenHash: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user','admin'], default: 'user' },
  refreshTokens: [RefreshTokenSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
