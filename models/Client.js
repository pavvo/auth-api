const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const clientSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  username: {
    type: String,
    required: [true, "Please enter a username"],
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  reputationPoints: {
    type: Number,
    default: 0,
  },
  uniqueString: {
    type: String,
    unique: true,
  },
});

// Hash password
clientSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Static method to login user
clientSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);

    if (auth) {
      if (!user.isVerified) {
        throw Error("Please confirm your email");
      }

      return user;
    }

    throw Error("Incorrect password");
  }
};

const Client = mongoose.model("client", clientSchema);

module.exports = Client;
