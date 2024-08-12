const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User Already Registered" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password required" });
    }
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    // Send success response
    res.status(201).json({ message: "User registration successful", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration Failed" });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ message: "All fields are Mandatory" });
    }

    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "Email or Password not Matched" });
    }
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(400).json({ message: "Wrong Password" });
    }
    const accessToken = jwt.sign(
      {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    // Send success response
    res.status(201).json({
      message: "User Login successful",
      user: { username: user.username, email: user.email },
      accessToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login Failed" });
  }
};
const getUser = async (req, res) => {
  try {
    const userid = req.user.id;
    const user = await User.findById({ _id: userid });
    if (!user) {
      return res.status(404).json({ message: "user Not Found" });
    }

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "User details cant retrived" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
};
