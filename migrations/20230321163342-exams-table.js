'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.createTable('Exams', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      subject: {
        type: Sequelize.STRING,
        allowNull: false
      },
      resit: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      type: {
        type: Sequelize.ENUM,
        values: ['exam', 'quiz', 'test'],
        allowNull: false
      },
      module: {
        type: Sequelize.STRING
      },
      mode: {
        type: Sequelize.ENUM,
        values: ['online', 'in-person'],
        allowNull: false
      },
      onlineUrl: {
        type: Sequelize.STRING,
      },
      room: {
        type: Sequelize.STRING,
      },
      seat: {
        type: Sequelize.STRING,
      },
      startDate: {
        type: Sequelize.DATE,
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.dropTable('Exams');
    
  }
};
