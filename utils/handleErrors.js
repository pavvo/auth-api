module.exports.handleErrors = (err) => {
  let errors = {};

  if (err.code === 11000) {
    if (Object.keys(err.keyPattern)[0] === "email") {
      errors["email"] = "That email is already in use";
    }

    if (Object.keys(err.keyPattern)[0] === "username") {
      errors["username"] = "That username is already in use";
    }

    return errors;
  }

  if (err.message === "Incorrect email") {
    errors["email"] = "Incorrect email";
  }

  if (err.message === "Incorrect password") {
    errors["password"] = "Incorrect password";
  }

  if (err.message === "Please confirm your email") {
    errors["message"] = "Please confirm your email";
  }

  if (err.message.includes("client validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};
