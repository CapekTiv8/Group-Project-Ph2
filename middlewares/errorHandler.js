const errorHandler = (error, req, res, next) => {
  let message = "Internal Server Error";
  let status = 500;

  if (
    error.name === "SequelizeConstraintError" ||
    error.name === "SequelizeValidationError"
  ) {
    status = 400;
    message = error.errors[0].message;
  }

  if (error.name === "EmailBadReq") {
    status = 400;
    message = "Email is Required";
  }

  if (error.name === "NameBadReq") {
    status = 400;
    message = "Name is Required";
  }

  if (error.name === "PassBadReq") {
    status = 400;
    message = "Password is Required";
  }

  if (error.name === "LoginError") {
    status = 400;
    message = "Invalid email/password";
  }

  if (error.name === "You are not authorized") {
    status = 401;
    message = "forbidden";
  }

  if (error.name === "Invalid token") {
    status = 401;
    message = "Unauthorized";
  }

  res.status(status).json({ message });
};

module.exports = errorHandler;
