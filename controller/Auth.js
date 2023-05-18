const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//signup route handler
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    //check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }
    //secure password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10); //10 number of round
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error while hashing password",
      });
    }
    //create entry for new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    return res.status(200).json({
      success: true,
      message: "user created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered,please try again later",
    });
  }
}
exports.login = async (req, res) => {
  try {
    //data fetch
    const { email, password } = req.body;
    //validatation on email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "please fill the  following fields",
      });
    }
    const user = await User.findOne({email});
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered",
      });
    }
    //verify password & generate a JWT token
    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        role: user.role,
      };
      //match the password
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;
      const options = {
        expires:new Date(Date.now() +30000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User logged in successfully",
      });
      // res.status(200).json({
      //   success: true,
      //   token,
      //   user,
      //   message: "User logged in successfully",
      // });
    } else {
      return res.status(403).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
        success: false,
        message: "Login failed",
      });
  }
};
