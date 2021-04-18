const jwt = require("jsonwebtoken");

const Client = require("../../models/Client");
const handleErrors = require("../../utils/handleErrors");
const generateUniqueString = require("../../utils/generateUniqueString");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_MAX_AGE,
  });
};

module.exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  const uniqueString = generateUniqueString.generateUniqueString();

  try {
    const user = await Client.create({ username, email, password, uniqueString });

    const token = createToken(user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: process.env.TOKEN_MAX_AGE * 1000,
    });

    res.status(201).json({ user: user._id, token: token });
  } catch (err) {
    const errors = handleErrors.handleErrors(err);
    res.status(400).send({ errors });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Client.login(email, password);

    const token = createToken(user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: process.env.TOKEN_MAX_AGE * 1000,
    });

    res.status(200).json({ user: user._id, token: token });
  } catch (err) {
    const errors = handleErrors.handleErrors(err);

    res.status(400).json({ errors });
  }
};

module.exports.verify = async (req, res) => {
  const { uniqueString } = req.params;

  const filter = { uniqueString };
  const update = { isVerified: true, uniqueString: null };

  let user = await Client.findOneAndUpdate(filter, update, {
    new: true,
  });

  if (user) {
    res.send("Succesfully verified email!");
  } else {
    res.send("User not found!");
  }
};
