const express = require("express");

const router = express.Router();
const auth = require("../middleware/auth");
const UserController = require("../controllers/UserController");

// @route  api/auth
// @method GET
// @access Public
router.get("/auth", auth, UserController.getLoggedInUser);

module.exports = router;
