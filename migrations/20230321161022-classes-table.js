'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  
    await queryInterface.createTable('Classes', {
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
      module: {
        type: Sequelize.STRING
      },
      mode: {
        type: Sequelize.ENUM,
        values: ['online', 'in-person'],
        allowNull: false
      },
      room: {
        type: Sequelize.STRING
      },
      building: {
        type: Sequelize.STRING
      },
      onlineUrl: {
        type: Sequelize.STRING
      },
      teacher: {
        type: Sequelize.STRING
      },
      teachersEmail: {
        type: Sequelize.STRING
      },
      occurs: {
        type: Sequelize.ENUM,
        values: ['once', 'repeating', 'rotational'],
        allowNull: false
      },
      days: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false
      },
      startDate: {
        type: Sequelize.DATE
      },
      endDate: {
        type: Sequelize.DATE
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: false
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
    
    await queryInterface.dropTable('Classes');

  }
};
