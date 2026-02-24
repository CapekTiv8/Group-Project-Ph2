"use strict";
const bcrypt = require("bcryptjs");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Room, { foreignKey: "User1_Id" });
      User.hasMany(models.Room, { foreignKey: "User2_Id" });
      User.hasMany(models.Message, { foreignKey: "Sender_Id" });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Username Required",
          },
          notNull: {
            msg: "Username Required",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Email must be unique",
        },
        validate: {
          notNull: {
            msg: "Email required",
          },
          notEmpty: {
            msg: "Email required",
          },
          isEmail: {
            msg: "Invalid email format",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Password Required",
          },
          notNull: {
            msg: "Password Required",
          },
          min: {
            args: 5,
            msg: "Password min 5 character",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate(ins) {
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(ins.password, salt);
          ins.password = hash;
        },
      },
    }
  );
  return User;
};
