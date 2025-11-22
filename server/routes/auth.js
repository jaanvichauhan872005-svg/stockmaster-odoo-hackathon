const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { signAccessToken, signRefreshToken, hashToken } = require('../utils/tokens');

const router = express.Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production' ? true : false,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/', // root path so cookie is sent for all api routes
};

// Helper to set cookie (clears old first to avoid concatenation)
function setRefreshCookie(res, token) {
  // clear any existing cookie with same name/options first
  try { res.clearCookie('jid', COOKIE_OPTIONS); } catch (e) { /* ignore */ }
  res.cookie('jid', token, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 days
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });

    const accessToken = signAccessToken({ sub: user._id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user._id });

    // store hashed refresh token with expiry
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    user.refreshTokens.push({ tokenHash, expiresAt });
    await user.save();

    // set cookie safely
    setRefreshCookie(res, refreshToken);

    res.json({ accessToken, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = signAccessToken({ sub: user._id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user._id });

    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    user.refreshTokens.push({ tokenHash, expiresAt });
    await user.save();

    // set cookie safely
    setRefreshCookie(res, refreshToken);

    res.json({ accessToken, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Refresh token: rotate refresh token
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies?.jid;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (e) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const userId = payload.sub;
    const user = await User.findById(userId);
    if (!user) return res.status(401).json({ message: 'User not found' });

    const tokenHash = hashToken(refreshToken);
    const stored = user.refreshTokens.find(rt => rt.tokenHash === tokenHash);
    if (!stored) {
      // possible reuse -> revoke all
      user.refreshTokens = [];
      await user.save();
      // clear cookie server-side
      res.clearCookie('jid', COOKIE_OPTIONS);
      return res.status(401).json({ message: 'Refresh token revoked' });
    }

    // rotate: remove existing token and add a new one
    user.refreshTokens = user.refreshTokens.filter(rt => rt.tokenHash !== tokenHash);

    const newRefreshToken = signRefreshToken({ sub: user._id });
    const newTokenHash = hashToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    user.refreshTokens.push({ tokenHash: newTokenHash, expiresAt });
    await user.save();

    const accessToken = signAccessToken({ sub: user._id, role: user.role });

    // IMPORTANT: clear previous cookie then set new one (prevents concatenation)
    setRefreshCookie(res, newRefreshToken);

    res.json({ accessToken, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout: remove refresh token (cookie) and server-side
router.post('/logout', async (req, res) => {
  try {
    const refreshToken = req.cookies?.jid;
    if (refreshToken) {
      try {
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(payload.sub);
        if (user) {
          const tokenHash = hashToken(refreshToken);
          user.refreshTokens = user.refreshTokens.filter(rt => rt.tokenHash !== tokenHash);
          await user.save();
        }
      } catch (e) {
        // ignore
      }
    }
    // clear cookie using same options used when setting it so browser removes it
    res.clearCookie('jid', COOKIE_OPTIONS);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected endpoint helper: get current user from access token
router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: 'No token' });
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(payload.sub).select('-passwordHash -refreshTokens');
    if (!user) return res.status(401).json({ message: 'Not found' });
    res.json({ user });
  } catch (e) {
    console.error(e);
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
