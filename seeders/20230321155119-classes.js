'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.bulkInsert('Classes', [{
      userId: 2,
      subject: 'Class 1',
      module: 'Module 1',
      mode: 'online',
      room: 'Room 1',
      building: 'Building 1',
      onlineUrl: 'https://www.google.com',
      teacher: 'Teacher 5',
      teachersEmail: 'teacher@test123.com',
      occurs: 'once',
      days: ['monday', 'tuesday'],
      startDate: new Date(),
      endDate: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    await queryInterface.bulkInsert('Classes', [{
      userId: 2,
      subject: 'Class 2',
      module: 'Module 1',
      mode: 'online',
      room: 'Room 1',
      building: 'Building 1',
      onlineUrl: 'https://www.google.com',
      teacher: 'Teacher 3',
      teachersEmail: 'teacher@test123.com',
      occurs: 'once',
      days: ['monday', 'tuesday'],
      startDate: new Date(),
      endDate: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    await queryInterface.bulkInsert('Classes', [{
      userId: 2,
      subject: 'Class 3',
      module: 'Module2',
      mode: 'online',
      room: 'Room 4',
      building: 'Building 4',
      onlineUrl: 'https://www.google.com',
      teacher: 'Teacher 2',
      teachersEmail: 'teacher@test123.com',
      occurs: 'once',
      days: ['monday', 'tuesday'],
      startDate: new Date(),
      endDate: new Date(),
      startTime: new Date(),
      endTime: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

  },

  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Classes', null, {});
    
  }
};
