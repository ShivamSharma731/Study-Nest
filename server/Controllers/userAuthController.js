const Users = require("../Models/UsersModel");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");

// creating jwt
const createToken = (_id) => {
  return jwt.sign({ _id }, "secretkeyforthisjwtiamwritingnotinenvfuckhackers", {
    expiresIn: "3d",
  });
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Users.login(email, password);
    const token = createToken(user._id);

    res.cookie("jwt", token, {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({
      message: "User logged in successfully",
      user: user,
      token: token,
      status: 200,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// SignUp user
const signUpUser = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const user = await Users.signup(email, username, password);

    // create token for this user
    const token = createToken(user._id);

    res.cookie("jwt", token, {
      maxAge: 3 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({
      message: "User created successfully",
      user: user,
      token: token,
      status: 200,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// logout user
const logoutUser = (req, res) => {
  // deleting cookie
  res.cookie("jwt", "", {
    maxAge: 0,
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(200).json({ message: "Logout successful" });
};

// forgot password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({ email });
    if (!user) {
      res.status(400).json({ error: "No user found from this email" });
    }
    const existingPassword = user.password;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "shivamsharma3172004@gmail.com",
        pass: "ShivamSharma@1970",
      },
    });

    const mailOptions = {
      to: user.email,
      from: "passwordreset@gmail.com",
      subject: "Sending a person his password because of his lost memory...",
      text: `Your current password is: ${existingPassword}\n\nPlease use it to log in.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password sent to your mail" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

module.exports = {
  loginUser,
  signUpUser,
  logoutUser,
  forgotPassword,
};
