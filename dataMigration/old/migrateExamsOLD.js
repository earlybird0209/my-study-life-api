// add db from config/sourceDB.js
const sequelizeSource = require('../../config/sourceDB');
const sequelizeTarget = require('../../config/db');
const { Sequelize } = require('sequelize');
const Exam = require('../../models/Exam');
const moment = require('moment');

const migrateExams = async function migrateExams() {

  const batchSize = 2000;
  let offset = 0;

  // set while true for full migration
  while (offset < 30000) {

    const sourceExams = await sequelizeSource.query('SELECT * FROM Exams ORDER BY Id ASC OFFSET '+offset+' ROWS FETCH NEXT '+batchSize+' ROWS ONLY', {
      type: sequelizeSource.QueryTypes.SELECT
    });

    if (sourceExams.length === 0) {
      // No more exams to migrate
      break;
    }

    await sequelizeTarget.transaction(async (transaction) => {
      // Loop through the sourceExams data and insert the rows into the target database
      for (const sourceExam of sourceExams) {
        // Check if the exam already exists in the target database
        const examExists = await Exam.findOne({
          where: {
            id: sourceExam.Id
          },
          transaction
        });
    
        if (examExists) {
          console.log('Exam already exists, ID:', sourceExam.Id);
          continue;
        }
    
        // Insert the exam data into the target database
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
        }, { transaction });
    
        console.log('Exam created:', sourceExam.Id);
      }
    });
    

    offset += batchSize;
  }

  await sequelizeSource.close();
 
}

module.exports = migrateExams;