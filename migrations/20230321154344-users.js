'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM,
        values: ['admin', 'student', 'teacher'],
        allowNull: false,
        defaultValue: 'student'
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate : {
          isEmail: {
            msg: "Email format is wrong"
          },
          notEmpty: {
            msg: 'Email cannot be empty'
          },
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      salt: {
        type: Sequelize.STRING,
        allowNull: false
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      verificationCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      profileImage: {
        type: Sequelize.STRING,
        allowNull: true
      },
      refreshToken: {
        type: Sequelize.STRING,
        allowNull: true
      },
      refreshTokenExpiryDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE
      }
      
    });
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.dropTable('Users');

  }
};
