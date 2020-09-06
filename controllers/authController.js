const User = require("../models/User");
const jwt = require("jsonwebtoken");

//Handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);

  let errors = { email: "", password: "" };

  // Duplicates error code
  if (err.code === 11000) {
    errors.email = "That email is already in use";
    return errors;
  }

  if (err.message === "Incorrect email") {
    errors.email = "Incorrect email";
  }

  if (err.message === "Incorrect password") {
    errors.password = "Incorrect password";
  }

  // Validate errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

// Max age for tokens & cookies
const maxAge = 3 * 24 * 60 * 60;

// Create JW token
const createToken = (id) => {
  return jwt.sign({ id }, "pavletto", {
    expiresIn: maxAge,
  });
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });

    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });

    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).send({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: maxAge * 1000,
    });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = async (req, res) => {
  res.cookie("jwt", "", {
    maxAge: 1,
  });
  res.redirect("/");
};
