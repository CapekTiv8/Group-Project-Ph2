"use strict";
const fs = require("fs").promises;
const { hashPassword } = require("../helpers/bcryptjs");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    let data = JSON.parse(await fs.readFile("./users.json", "utf8")).map(
      (el) => {
        delete el.id;
        el.createdAt = el.updatedAt = new Date();
        el.password = hashPassword(el.password);
        return el;
      },
    );
    await queryInterface.bulkInsert("Users", data, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {});
  },
};
