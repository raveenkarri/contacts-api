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

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    // Send success response
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration Failed" });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "All fields are Mandatory" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "Email or Password not Matched" });
    }
    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.json({ message: "Password not matched" });
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

    res.cookie("token", accessToken, {
      expires: new Date(Date.now() + 60 * 60 * 1000),
    });

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
      return res.json({ message: "user Not Found" });
    }

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.json({ message: "User details cant retrived" });
  }
};
const createContact = async (req, res) => {
  try {
    const { contacts } = req.body;
    const id = req.user.id;
    const user = await User.findById(id);
    if (!user) {
      return res.json({ message: "user Not Found" });
    }
    await user.contacts.push(...contacts);
    await user.save();
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.json({ message: "cant send user contacts" });
  }
};
const getContacts = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (!user) {
      res.json({ message: "user Contacts not Found" });
    }
    res.json({ contacts: user.contacts });
  } catch (error) {
    res.json({ message: "errorrrr " });
  }
};
const getContact = async (req, res) => {
  try {
    const contactId = req.params.id;

    const id = req.user.id;
    const user = await User.findById(id);
    if (!user) {
      res.json({ message: "Contacts not Found" });
    }
    const index = user.contacts.findIndex((contact) => {
      return contact._id.toString() === contactId;
    });

    if (index === -1) {
      return res.json({ message: "Contact not found" });
    }

    res.json(user.contacts[index]);
  } catch (error) {
    res.json({ message: "errorrrr" });
  }
};
const updateContact = async (req, res) => {
  try {
    const contactId = req.params.id;
    // const {contacts} = req.body; ||  const data = req.body.contacts;

    const data = req.body.contacts;

    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ message: "User not found" });
    }

    const index = user.contacts.findIndex((contact) => {
      return contact._id.toString() === contactId;
    });

    if (index === -1) {
      return res.json({ message: "Contact not found" });
    }

    user.contacts[index] = {
      ...user.contacts[index]._doc,
      ...data[0],
    };

    // Save the updated user
    await user.save();

    res.json({ UpdatedContact: user.contacts[index] });
  } catch (error) {
    console.error(error);
    res.json({ message: "Error in catch" });
  }
};

const deleteContact = async (req, res) => {
  try {
    const userId = req.user.id;
    const contactId = req.params.id;

    console.log("User ID:", userId);
    console.log("Contact ID to delete:", contactId);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { contacts: { _id: contactId } },
      },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("deleted User Document:", user);

    res.json({ message: "Contact deleted successfully", user });
  } catch (error) {
    console.error("Error during deletion:", error);
    res.status(500).json({ message: "Error deleting contact", error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  createContact,
  getContacts,
  updateContact,
  getContact,
  deleteContact,
};
