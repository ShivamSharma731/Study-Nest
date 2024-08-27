const { text } = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    // required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// static signup method
userSchema.statics.signup = async function (email, username, password) {
  // check if user exist or not already
  const exists = await this.findOne({ email });
  if (!email || !password) {
    throw Error("All fields must be filled...");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email not valid...");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not string enough...");
  }
  if (exists) {
    throw Error("User already exists...");
  }

  // hashing the user password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  // adding the user to the database
  const user = await this.create({ email, username, password: hashPassword });

  return user;
};

// static login method
userSchema.statics.login = async function (identifier, password) {
  if (!identifier || !password) {
    throw Error("All fields must be filled...");
  }

  let user;
  // code to add the functionality so that user during login can either login by using username or email
  if (validator.isEmail(identifier)) {
    user = await this.findOne({ email: identifier });
  } else {
    // If it's not an email, assume it's a username
    user = await this.findOne({ username: identifier });
  }

  if (!user) {
    throw Error("User does not exist...");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password...");
  }

  return user;
};

const Users = mongoose.model("Users", userSchema);
module.exports = Users;
