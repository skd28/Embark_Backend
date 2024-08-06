// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require("../models/User");
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateOTP = () => {
  return crypto.randomBytes(4).toString('hex');
};

const sendOTPEmail = async (user) => {
  const otp = generateOTP();
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
  await user.save();

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: user.email,
    subject: 'OTP for Two-Factor Authentication',
    text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
  };

  return transporter.sendMail(mailOptions);
};


const userSignup = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const userExist = await User.findOne({ username });
    if (userExist) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const user = new User({ username, email, password });
    await user.save();

    await sendOTPEmail(user);
    return res.status(201).json({ message: 'User registered successfully. Please check your email for OTP.' });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Email not verified' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({ message: 'User Created', token, user: { id: user._id, username: user.username, email: user.email } });

  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};



const otpVerify = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User does not exist' });
  }

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  //const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });  , token, user: { id: user._id, username: user.username, email: user.email } }

  res.status(200).json({ message: 'OTP verified successfully' });
};

module.exports = {
  userSignup,
  userLogin,
  otpVerify
};

