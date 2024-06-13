
// authController.js

module.exports = {
    loginUser: (req, res) => {
        res.send("Login");
    },
    signupUser: (req, res) => {
        res.send("Signup");
    },
    free_page:(req,res) => {
        res.send("Free Pages");
    }
};




// const bcrypt = require('bcrypt');
 // const User = require('../models/User');
