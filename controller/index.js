const bcrypt = require('bcrypt')
const User = require("../models/login_model")
module.exports = {

    loginUser:(req,res) => {
        res.send("Login")
    },
    signupUser : (req,res) => {
        res.send("Signup");
    }
}