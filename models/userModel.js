const mongoose = require("mongoose");

// Define the contact schema
const contactSchema = mongoose.Schema({
  name: {
    type: String,
  },
  contactEmail: {
    type: String,
  },
  phone: {
    type: String,
  },
});

// Define the user schema with embedded contacts
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    contacts: [contactSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
