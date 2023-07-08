'use strict';

const crypto = require('crypto');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    var salt = require('crypto').randomBytes(16).toString('hex');
    var hashedPass = crypto.pbkdf2Sync("123123", salt, 310000, 32, 'sha256').toString('hex');
    var verificationCode = crypto.randomBytes(16).toString('hex');

    await queryInterface.bulkInsert('Users', [{
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@admin.com',
      password: hashedPass,
      salt: salt,
      isVerified: true,
      verificationCode: verificationCode,
      profileImage: 'https://www.google.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    await queryInterface.bulkInsert('Users', [{
      role: 'student',
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@test123.com',
      password: hashedPass,
      salt: salt,
      isVerified: true,
      verificationCode: verificationCode,
      profileImage: 'https://www.google.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Users', null, {});

  }
};
