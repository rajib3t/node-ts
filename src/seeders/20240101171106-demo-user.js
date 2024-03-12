const bcrypt = require("bcrypt");


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    // Insert user
    await queryInterface.bulkInsert('users', [{
      'uuid': 'd290f1ee-6c54-4b01-90e6-d701748f0851', // 'd290f1ee-6c54-4b01-90e6-d701748f0851' 
      firstname: 'Rajib',
      lastname: 'Mondal',
      email: 'rajib@pythonkolkata.com',
      password:bcrypt.hashSync('123456', 8),
      is_admin: true,
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    // Delete user
    await queryInterface.bulkDelete('users', null, {});

  }
};
