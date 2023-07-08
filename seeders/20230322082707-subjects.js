'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
    await queryInterface.bulkInsert('Subjects', [
      {
        userId: 1,
        subject: 'Maths',
        color: '#FF0000',
        image: 'https://cdn.pixabay.com/photo/2017/08/05/11/16/logo-2582748_1280.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        subject: 'English',
        color: '#FF0000',
        image: 'https://cdn.pixabay.com/photo/2017/08/05/11/16/logo-2582748_1280.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        subject: 'Science',
        color: '#FF0000',
        image: 'https://cdn.pixabay.com/photo/2017/08/05/11/16/logo-2582748_1280.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        subject: 'Maths',
        color: '#FF0000',
        image: 'https://cdn.pixabay.com/photo/2017/08/05/11/16/logo-2582748_1280.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        subject: 'English',
        color: '#FF0000',
        image: 'https://cdn.pixabay.com/photo/2017/08/05/11/16/logo-2582748_1280.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        subject: 'Science',
        color: '#FF0000',
        image: 'https://cdn.pixabay.com/photo/2017/08/05/11/16/logo-2582748_1280.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        subject: 'Maths',
        color: '#FF0000',
        image: 'https://cdn.pixabay.com/photo/2017/08/05/11/16/logo-2582748_1280.png',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
    ]);
},

  async down (queryInterface, Sequelize) {
   
    await queryInterface.bulkDelete('Subjects', null, {});
    
  }
};
