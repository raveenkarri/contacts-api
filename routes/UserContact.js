const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUser,
  logoutUser,
} = require("../controller/UserController");
const {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
} = require("../controller/ContactController");
const { validateToken } = require("../middleware/validateToken");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", validateToken, logoutUser);
router.get("/user", validateToken, getUser);
router.post("/create", validateToken, createContact);
router.get("/userContacts", validateToken, getContacts);
router.get("/userContact/:id", validateToken, getContact);
router.put("/update/:id", validateToken, updateContact);
router.delete("/delete/:id", validateToken, deleteContact);

module.exports = router;
