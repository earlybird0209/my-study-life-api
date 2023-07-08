// add db from config/sourceDB.js
const sequelizeSource = require('../config/sourceDB');
const { Subject } = require('../config/db');
const { Sequelize } = require('sequelize');

const migrateSubjects = async function migrateSubjects() {
    
      const query = 'SELECT TOP 1000 * FROM Subjects ORDER BY "Id" ASC;';
      const Subjects = await sequelizeSource.query(query, { type: Sequelize.QueryTypes.SELECT });

      // console.log(Subjects);
      // return true;

      // save Subjects to target db with model Subjects
      Subjects.map(async (subject) => {
		
        // check if subject already exists
        const subjectExists = await Subject.findOne({
          where: {
            id: subject.Id
          }
        });

        if (subjectExists) {
          console.log('Subject already exists, ID: ', subject.Id);
          return;
        }

				try {

          await Subject.create({
            id: subject.Id,
            subject: subject.Name,
            userId: subject.UserId,
            color: subject.Color,
            createdAt: subject.CreatedAt,
            updatedAt: subject.UpdatedAt
          });

          console.log('Subject created:', subject.Id);

        } catch (error) {
          console.error('Error while getting Subjects:', error);
        } finally {
          
        }
        
      });

			await sequelizeSource.close();
 
}

module.exports = migrateSubjects;