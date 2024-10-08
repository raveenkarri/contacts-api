const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUser,
} = require("../controller/UserController");
const {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
} = require("../controller/ContactController");
const { validateToken } = require("../middleware/validateToken");
//user routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", validateToken, getUser);
//contact routes
router.post("/create", validateToken, createContact);
router.get("/userContacts", validateToken, getContacts);
router.get("/userContact/:id", validateToken, getContact);
router.put("/update/:id", validateToken, updateContact);
router.delete("/delete/:id", validateToken, deleteContact);

module.exports = router;
