// add db from config/sourceDB.js
const sequelizeSource = require('../config/sourceDB');
const { Holiday } = require('../config/db');
const { Sequelize } = require('sequelize');
const moment = require('moment');

const migrateHolidays = async function migrateHolidays() {
    
      const query = "SELECT TOP 1000 Holidays.*, AcademicSchedules.UserId FROM Holidays JOIN AcademicSchedules ON Holidays.YearId = AcademicSchedules.Id ORDER BY Holidays.Id ASC";
      const sourceHolidays = await sequelizeSource.query(query, { type: Sequelize.QueryTypes.SELECT });

      // console.log(sourceHolidays);
      // return true;

      // save Holidays to target db with model Holidays
      sourceHolidays.map(async (sourceHolidays) => {
		
        // check if Holidays already exists
        const HolidaysExists = await Holiday.findOne({
          where: {
            id: sourceHolidays.Id
          }
        });

        if (HolidaysExists) {
          console.log('Holidays already exists, ID: ', sourceHolidays.Id);
          return;
        }

				try {

          await Holiday.create({
            id: sourceHolidays.Id,
            userId: sourceHolidays.UserId,
            yearId: sourceHolidays.YearId,
            title: sourceHolidays.Name,
            image: null,
            startDate: sourceHolidays.StartDate,
            endDate: sourceHolidays.EndDate,
            createdAt: sourceHolidays.CreatedAt,
            updatedAt: sourceHolidays.UpdatedAt
          });

          console.log('Holidays created:', sourceHolidays.Id);

        } catch (error) {
          console.error('Error while getting Holidays:', error);
        } finally {
          
        }
        
      });

			await sequelizeSource.close();
 
}

module.exports = migrateHolidays;
