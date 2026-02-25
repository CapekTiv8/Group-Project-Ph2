"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Room.belongsTo(models.User, { foreignKey: "User1_Id" });
      Room.belongsTo(models.User, { foreignKey: "User2_Id" });
      Room.hasMany(models.Message, { foreignKey: "Room_Id" });
    }
  }
  Room.init(
    {
      User1_Id: DataTypes.INTEGER,
      User2_Id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Room",
    }
  );
  return Room;
};
