// add db from config/sourceDB.js
const sequelizeSource = require('../config/sourceDB');
const { Class } = require('../config/db');
const { Sequelize } = require('sequelize');
const moment = require('moment');

const migrateClasses = async function migrateClasses() {
    
      const query = 'SELECT TOP 1000 * FROM Classes ORDER BY "Id" ASC;';
      const sourceClasses = await sequelizeSource.query(query, { type: Sequelize.QueryTypes.SELECT });

      // console.log(sourceClasses);
      // return true;

      // save Classs to target db with model Classs
      sourceClasses.map(async (sourceClass) => {
		
        // check if class already exists
        const classExists = await Class.findOne({
          where: {
            id: sourceClass.Id
          }
        });

        if (classExists) {
          console.log('class already exists, ID: ', sourceClass.Id);
          return;
        }

				try {

          await Class.create({
            id: sourceClass.Id,
            userId: sourceClass.UserId,
            subjectId: sourceClass.SubjectId,
            module: sourceClass.Module,
            mode: 'in-person',
            room: sourceClass.Room,
            building: sourceClass.Building,
            onlineUrl: null,
            teacher: sourceClass.Tutor,
            teachersEmail: null,
            occurs: getOccurs(sourceClass.Occurs),
            days: getDays(sourceClass.Day),
            startDate: sourceClass.StartDate ? sourceClass.StartDate : sourceClass.Date,
            endDate: sourceClass.EndDate ? sourceClass.EndDate : sourceClass.Date,
            startTime: null,
            endTime: null,
            timestamp: moment.unix(sourceClass.Timestamp).format('YYYY-MM-DD HH:mm:ss'),
            createdAt: sourceClass.CreatedAt,
            updatedAt: sourceClass.UpdatedAt
          });

          console.log('Class created:', sourceClass.Id);

        } catch (error) {
          console.error('Error while getting classes:', error);
        } finally {
          
        }
        
      });

			await sequelizeSource.close();
 
}

function getOccurs(occurs) {
  switch (occurs) {
    case 0:
      return 'once';
    case 1:
      return 'repeating';
    case 2:
      return 'rotational';
    default:
      return 'once';
  }
}

function getDays(day) {
  switch (day) {
    case 0:
      return ['Monday'];
    case 1:
      return ['Tuesday'];
    case 2:
      return ['Wednesday'];
    case 3:
      return ['Thursday'];
    case 4:
      return ['Friday'];
    case 5:
      return ['Saturday'];
    case 6:
      return ['Sunday'];
    default:
      return null;
  }
}

module.exports = migrateClasses;