const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserService = require("../service/UserService");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // see if user exist
    const user = await UserService.findUser(email);
    if (user) {
      return res.status(400).send({
        success: false,
        message: "This Email already registered on our system"
      });
    }

    // Encrypt password
    const hashPwd = bcrypt.hashSync(password, 10);

    // create user object
    const newUser = {
      name,
      email,
      password: hashPwd
    };

    await UserService.createNewUser(newUser);

    return res.status(200).send({
      success: true,
      message: "User registered successfully"
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Server Error"
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.findUser(email);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid User Details"
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).send({
        success: false,
        message: "Invalid User Details"
      });
    }
    const payload = {
      user: {
        id: user.id
      }
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: 360000
    });
    return res.status(200).send({
      success: true,
      message: "User Logged In",
      token
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Server Error"
    });
  }
};

exports.getLoggedInUser = async (req, res) => {
  try {
    const user = await UserService.findUserById(req.user.id);
    if (!user) {
      return res.status(404).send({
        success: true,
        message: "No User Found",
        user: null
      });
    }
    return res.status(200).send({
      success: true,
      user
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Server Error"
    });
  }
};
