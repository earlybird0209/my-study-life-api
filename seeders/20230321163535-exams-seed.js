'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('Exams', [{
      userId: 2,
      subject: 'Exam 1',
      resit: false,
      type: 'exam',
      module: 'Module 1',
      mode: 'online',
      onlineUrl: 'https://www.google.com',
      room: 'Room 1',
      seat: 'Seat 1',
      startDate: new Date(),
      startTime: new Date(),
      duration: 60,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    await queryInterface.bulkInsert('Exams', [{
      userId: 2,
      subject: 'Exam 2',
      resit: false,
      type: 'exam',
      module: 'Module 2',
      mode: 'online',
      onlineUrl: 'https://www.google.com',
      room: 'Room 1',
      seat: 'Seat 1',
      startDate: new Date(),
      startTime: new Date(),
      duration: 60,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('Exams', null, {});
    
  }
};
