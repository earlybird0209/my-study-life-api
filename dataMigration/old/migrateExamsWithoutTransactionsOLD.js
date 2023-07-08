// add db from config/sourceDB.js
const sequelizeSource = require('../../config/sourceDB');
const sequelizeTarget = require('../../config/db');
const { Sequelize } = require('sequelize');
const Exam = require('../../models/Exam');
const moment = require('moment');

const migrateExamsWithoutTransactions = async function migrateExamsWithoutTransactions() {
    
  const batchSize = 1000;
  let offset = 0;

  // set while true for full migration
  while (offset >= 10000) {

    const sourceExams = await sequelizeSource.query('SELECT * FROM Exams ORDER BY Id ASC OFFSET '+offset+' ROWS FETCH NEXT '+batchSize+' ROWS ONLY', {
      type: sequelizeSource.QueryTypes.SELECT
    });

    if (sourceExams.length === 0) {
      // No more exams to migrate
      break;
    }

    for (const sourceExam of sourceExams) {

      // check if Exam already exists
      const examExists = await Exam.findOne({
        where: {
          id: sourceExam.Id
        }
      });

      if (examExists) {
        console.log('Exam already exists, ID: ', sourceExam.Id);
        continue;
      }

      try {

        await Exam.create({
          id: sourceExam.Id,
          resit: sourceExam.Resit,
          userId: sourceExam.UserId,
          subjectId: sourceExam.SubjectId,
          module: sourceExam.Module,
          type: 'exam',
          seat: sourceExam.Seat,
          room: sourceExam.Room,
          mode: 'in-person',
          startDate: moment(sourceExam.Date).format('YYYY-MM-DD'),
          startTime: moment(sourceExam.Date).format('HH:mm:ss'),
          duration: sourceExam.Duration,
          createdAt: sourceExam.CreatedAt,
          updatedAt: sourceExam.UpdatedAt
        });

        console.log('Exam created:', sourceExam.Id);

      } catch (error) {
        console.error('Error while getting Exams:', error);
      }
        
    }

    offset += batchSize;
  }

  await sequelizeSource.close();
 
}

module.exports = migrateExamsWithoutTransactions;