const { User } = require("../models");
const { signToken } = require("../helpers/jwt");
const { comparePassword } = require("../helpers/bcryptjs");

class AuthController {
  static async Register(req, res, next) {
    try {
      const { username, email, password } = req.body;
      const user = await User.create({
        username,
        email,
        password,
      });
      res.status(201).json({
        id: user.id,
        email: user.email,
      });
    } catch (error) {
      next(error);
    }
  }

  static async Login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email) throw { name: "EmailBadReq" };
      if (!password) throw { name: "PassBadReq" };
      const user = await User.findOne({
        where: {
          email,
        },
      });
      if (!user) throw { name: "LoginError" };
      if (!comparePassword(password, user.password))
        throw { name: "LoginError" };
      const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
      };
      const access_token = signToken(payload);
      res.status(200).json({ access_token });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = AuthController;
