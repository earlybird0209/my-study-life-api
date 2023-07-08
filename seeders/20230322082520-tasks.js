'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('Tasks', [
      {
        userId: 1,
        subject: 'Maths',
        details: 'Do the homework',
        type: 'homework',
        category: 'assignment',
        occurs: 'once',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        subject: 'English',
        details: 'Do the homework',
        type: 'homework',
        category: 'assignment',
        occurs: 'once',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        subject: 'Science',
        details: 'Do the homework',
        type: 'homework',
        category: 'assignment',
        occurs: 'once',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        subject: 'Maths',
        details: 'Do the homework',
        type: 'homework',
        category: 'assignment',
        occurs: 'once',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        subject: 'English',
        details: 'Do the homework',
        type: 'homework',
        category: 'assignment',
        occurs: 'once',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        subject: 'Science',
        details: 'Do the homework',
        type: 'homework',
        category: 'assignment',
        occurs: 'once',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        dueDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
        
    }]);

  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('Tasks', null, {});
    
  }
};
