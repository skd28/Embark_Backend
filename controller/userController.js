// routes/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');



// Signup Route
// Signup Route
const UserSign = async (req, res) => {    
    const { username, email, password } = req.body;
  
    try {
      // Check if the user already exists
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Create new user
      user = new User({ username, email, password });
      await user.save();
  
    //   // Generate JWT token
    //   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    //     expiresIn: '1h',
    //   });
  
      res.status(200).json({ message: "User Created "});
    } catch (err) {
      console.error(err); // Log the error for debugging
      res.status(500).json({ message: 'Server error' });
    }
  };
  
// Login Route
const UserLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check the password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: '1h',
    // });

    res.status(200).json({message : "user sucessfull login "},user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
    UserSign ,
    UserLogin
}

