// add db from config/sourceDB.js
const sequelizeSource = require('../config/sourceDB');
const { Task } = require('../config/db');
const { Sequelize } = require('sequelize');
const moment = require('moment');

const migrateTasks = async function migrateTasks() {
    
      const query = 'SELECT TOP 1000 * FROM Tasks ORDER BY "Id" ASC;';
      const sourceTaskes = await sequelizeSource.query(query, { type: Sequelize.QueryTypes.SELECT });

      // console.log(sourceTaskes);
      // return true;

      // save Tasks to target db with model Tasks
      sourceTaskes.map(async (sourceTask) => {
		
        // check if Task already exists
        const TaskExists = await Task.findOne({
          where: {
            id: sourceTask.Id
          }
        });

        if (TaskExists) {
          console.log('Task already exists, ID: ', sourceTask.Id);
          return;
        }

				try {

          await Task.create({
            id: sourceTask.Id,
            userId: sourceTask.UserId,
            subjectId: sourceTask.SubjectId,
            examId: sourceTask.ExamId, 
            type: sourceTask.Type,
            details: sourceTask.Detail,
            category: null,
            progress: sourceTask.Progress,
            occurs: getOccurs(sourceTask.Occurs),
            days: getDays(sourceTask.Day),
            dueDate: sourceTask.DueDate,
            completedAt: sourceTask.CompletedAt,
            createdAt: sourceTask.CreatedAt,
            updatedAt: sourceTask.UpdatedAt
          });

          console.log('Task created:', sourceTask.Id);

        } catch (error) {
          console.error('Error while getting Taskes:', error);
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

module.exports = migrateTasks;