import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
const makeToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const safeUser = user => ({ id: user._id, name: user.name, email: user.email });
export const register = asyncHandler(async (req, res) => {
  let { name, email, password } = req.body;
  if (![name, email, password].every(v => typeof v === 'string' && v.trim())) return res.status(400).json({ message: 'Name, email and password are required.' });
  name = name.trim(); email = email.trim().toLowerCase();
  if (name.length < 2 || name.length > 60) return res.status(400).json({ message: 'Name must be between 2 and 60 characters.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Please enter a valid email address.' });
  if (password.length < 8 || password.length > 72) return res.status(400).json({ message: 'Password must be between 8 and 72 characters.' });
  if (await User.exists({ email })) return res.status(409).json({ message: 'An account with this email already exists. Please log in.' });
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 12) });
  res.status(201).json({ message: 'Account created successfully.', token: makeToken(user._id), user: safeUser(user) });
});
export const login = asyncHandler(async (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Invalid email or password.' });
  res.json({ message: 'Logged in successfully.', token: makeToken(user._id), user: safeUser(user) });
});
export const me = asyncHandler(async (req, res) => res.json({ user: safeUser(req.user) }));
