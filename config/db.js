const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://'+process.env.DB_USER+':'+process.env.DB_PASSWORD+'@'+process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB_NAME,
// const sequelize = new Sequelize('postgres://'+'postgres'+':'+'postgres'+'@'+'127.0.0.1'+':'+'5432'+'/'+'mystudylife',
{
  pool: {
    max: 15,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

// Models
const User = require('../models/User')(sequelize);
const Exam = require('../models/Exam')(sequelize);
const Subject = require('../models/Subject')(sequelize);
const Class = require('../models/Class')(sequelize);
const Task = require('../models/Task')(sequelize);
const Holiday = require('../models/Holiday')(sequelize);
const Partnership = require('../models/Partnership')(sequelize);
const UserSocialLogins = require('../models/UserSocialLogins')(sequelize);
const Xtra = require('../models/Xtra')(sequelize);


// Associations
Class.belongsTo(Subject, {
  foreignKey: 'subjectId',
  as: 'subject'
});

Exam.belongsTo(Subject, {
  foreignKey: 'subjectId',
  as: 'subject'
});

Task.belongsTo(Subject, {
  foreignKey: 'subjectId',
  as: 'subject'
});

Task.belongsTo(Exam, {
  foreignKey: 'examId',
  as: 'exam'
});

// Task.belongsTo(Class, {
//   foreignKey: 'classId',
//   as: 'class'
// });

Class.hasMany(Task, {
  foreignKey: 'classId',
  as: 'tasks'
});

// Subject.hasMany(Exam, {
//   foreignKey: 'subjectId',
//   as: 'exams'
// });


module.exports = {
  sequelize,
  User,
  Exam,
  Subject,
  Class,
  Task,
  Holiday,
  Partnership,
  UserSocialLogins,
  Xtra
};