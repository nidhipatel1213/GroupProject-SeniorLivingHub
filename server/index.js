const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const UserModel = require("./db/models/User");

const app = express();
app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({}));

mongoose.connect("mongodb+srv://anztom22:anztom22@cluster0.xe7dgf8.mongodb.net/users?retryWrites=true&w=majority");//provide your mongodb link here


//api for signup and it checks that
app.post("/signUp", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  let getUser = await UserModel.findOne({
    email: req.body.email,
  });
  if (getUser) {
    res.json({
      message: "This email is already exist. Please use another email.",
    });
  } else {
    let createUser = await UserModel.create({
      ...req.body,
      password: hashedPassword,
    });
    res.json({ message: "User created successfully..", data: createUser });
  }
});

//api for login
app.post("/login", async (req, res) => {
  const getUser = await UserModel.findOne({ email: req.body.email });

  if (!getUser) {
    res.json({
      message: "Email not found, please signUp first",
    });
  } else {
    const validPassword = await bcrypt.compare(
      req.body.password,
      getUser.password
    );
    if (validPassword) {
      res.json({
        message: "Welcome! You have successfully logged in",
      });
    } else {
      res.json({ message: "Password is incorrect!" });
    }
  }
});

app.listen(3001, () => {
  console.log("Server is running on 3001 port.");
});
