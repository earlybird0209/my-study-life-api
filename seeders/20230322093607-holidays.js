'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.bulkInsert('Holidays', [
      {
        userId: 1,
        title: 'Christmas',
        image: 'https://cdn.pixabay.com/photo/2016/12/25/14/36/christmas-1932230_960_720.jpg',
        startDate: new Date(2023, 11, 25),
        endDate: new Date(2023, 11, 25),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        title: 'New Year',
        image: 'https://cdn.pixabay.com/photo/2016/12/25/14/36/christmas-1932230_960_720.jpg',
        startDate: new Date(2023, 11, 31),
        endDate: new Date(2023, 11, 31),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        title: 'Easter',
        image: 'https://cdn.pixabay.com/photo/2016/12/25/14/36/christmas-1932230_960_720.jpg',
        startDate: new Date(2023, 3, 2),
        endDate: new Date(2023, 3, 5),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        title: 'Halloween',
        image: 'https://cdn.pixabay.com/photo/2016/12/25/14/36/christmas-1932230_960_720.jpg',
        startDate: new Date(2023, 9, 31),
        endDate: new Date(2023, 9, 31),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        title: 'Valentines Day',
        image: 'https://cdn.pixabay.com/photo/2016/12/25/14/36/christmas-1932230_960_720.jpg',
        startDate: new Date(2023, 1, 14),
        endDate: new Date(2023, 1, 14),
        createdAt: new Date(),
        updatedAt: new Date()
      }
  ]);

},
  async down (queryInterface, Sequelize) {

    await queryInterface.bulkDelete('Holidays', null, {});

  }
};
