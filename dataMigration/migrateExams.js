// add db from config/sourceDB.js
const sequelizeSource = require('../config/sourceDB');
const { Sequelize } = require('sequelize');
const { Exam } = require('../config/db');
const moment = require('moment');

const migrateExams = async function migrateExams() {
    
  const batchSize = 20000;
  let offset = 0;

  // set while true for full migration
  while (offset <= 30000) {

    const sourceExams = await sequelizeSource.query('SELECT * FROM Exams ORDER BY Id ASC OFFSET '+offset+' ROWS FETCH NEXT '+batchSize+' ROWS ONLY', {
      type: sequelizeSource.QueryTypes.SELECT
    });

    // console.log(sourceExams.length);

    if (sourceExams.length === 0) {
      // No more exams to migrate
      break;
    }

    // Fetch existing exams in the target database
    const existingExams = await Exam.findAll({
      where: {
        id: sourceExams.map(exam => exam.Id)
      }
    });

    // console.log(existingExams.length);

    // Filter out exams that already exist in the target database
    const newExams = sourceExams.filter(sourceExam =>
      !existingExams.find(existingExam => existingExam.id === sourceExam.Id)
    );

    // Prepare exams for bulk insertion
    const examsToCreate = newExams.map(sourceExam => ({
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
    }));

    try {
      await Exam.bulkCreate(examsToCreate);

      console.log('Exams created:', examsToCreate.length);
    } catch (error) {
      console.error('Error while creating Exams:', error);
    }

    offset += batchSize;
  }

//   await sequelizeSource.close();
}

module.exports = migrateExams;
