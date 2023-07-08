'use strict';
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  
    // await queryInterface.sequelize.query(`CREATE TYPE "public"."enum_Tasks_occurs" AS ENUM ('once', 'repeating', 'rotational');`);

    await queryInterface.createTable('Tasks', {
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
      details: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.ENUM,
        values: ['reminder', 'revision', 'essay', 'assignment', 'project', 'meeting', 'reading', 'other'],
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
      dueDate: {
        type: Sequelize.DATE,
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
   
    await queryInterface.dropTable('Tasks');
    await queryInterface.sequelize.query('DROP TYPE "public"."enum_Tasks_occurs";');

  }
};
