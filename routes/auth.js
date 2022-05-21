const express = require("express");

const router = express.Router();
const Auth = require("../middleware/auth");
const UserController = require("../controllers/UserController");

// @route  api/auth
// @method GET
// @access Public
router.get("/auth", Auth, UserController.getLoggedInUser);

module.exports = router;
