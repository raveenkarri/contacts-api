const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createContact = async (req, res) => {
  try {
    const { name, contactEmail, phone } = req.body;
    const id = req.user.id;
    const contacts = [{ name, contactEmail, phone }];
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
      return res.json({ message: "user Contacts not Found" });
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
    const { name, contactEmail, phone } = req.body;
    if (!name || !contactEmail || !phone) {
      return res.status(404).json({ message: "All fields are mandatory?" });
    }
    const contacts = { name, contactEmail, phone };

    const userId = req.user.id;
    //using update method in mongoose

    const user = await User.updateOne(
      { _id: userId, "contacts._id": contactId },
      {
        $set: { "contacts.$": contacts },
      }
    );
    if (user.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Contact has no updates or not found" });
    }

    res.status(200).json({ message: "Contact updated successfully" });
    //manually updating user contact by id

    // const user = await User.findById(userId);
    // if (!user) {
    //   return res.json({ message: "User not found" });
    // }

    // const index = user.contacts.findIndex((contact) => {
    //   return contact._id.toString() === contactId;
    // });

    // if (index === -1) {
    //   return res.json({ message: "Contact not found" });
    // }

    // user.contacts[index] = contacts;

    // // Save the updated user
    // await user.save();
    // res.status(200).json({ message: "Contact updated successfully" });
  } catch (error) {
    console.error(error);
    res.json({ message: "Error in catch" });
  }
};

const deleteContact = async (req, res) => {
  try {
    const userId = req.user.id;
    const contactId = req.params.id;
    //mongoose method
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { contacts: { _id: contactId } },
      },
      { new: true } // Return the updated document
    );
    //for manual deletion---filter contacts array with contactId and --save user
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.error("Error during deletion:", error);
    res.status(500).json({ message: "Error deleting contact", error });
  }
};
module.exports = {
  createContact,
  getContacts,
  updateContact,
  getContact,
  deleteContact,
};
