'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'Books',
      [
        {
          id: 99,
          title: 'Doe',
          year: 1223,
          author: 'jonas mollet',
          createdAt: '19.11.2018',
          updatedAt: '19.11.2018'
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Books', null, {});
  }
};
