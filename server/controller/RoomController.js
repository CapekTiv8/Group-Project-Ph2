const {Room, Message} = require('../models');

class RoomController {
  static async createRoom(req, res, next) {
    try {
      const {User1_Id, User2_Id} = req.body;
      const room = await Room.create({
        User1_Id,
        User2_Id
      });
      res.status(201).json(room);
    } catch (error) {
      next(error);
    } 
  }
//   static async newMessage(req, res, next) {
//     try {
//       const {RoomId, UserId, text} = req.body;
//       const message = await Message.create({
//         RoomId,
//         UserId,
//         text
//       });
//       res.status(201).json(message);
//     } 
//     catch (error) {
//       next(error);
//     }
//   }
//   static async getMessages(req, res, next) {
//     try {
//       const {RoomId} = req.params;
//       const messages = await Message.findAll({
//         where: {
//           RoomId
//         }
//       });
//       res.status(200).json(messages);
//     } 
//     catch (error) {
//       next(error);
//     } 
//   }
}

module.exports = RoomController;