// add db from config/sourceDB.js
const sequelizeSource = require('../config/sourceDB');
const sequelizeTarget = require('../config/db');
const { Sequelize } = require('sequelize');
const User = require('../models/User');
const migrateUsers = require('./migrateUsers');
const migrateSubjects = require('./migrateSubjects');
const migrateExams = require('./migrateExams');
const migrateClasses = require('./migrateClasses');
const migrateHolidays = require('./migrateHolidays');
const migrateTasks = require('./migrateTasks');


// migrateUsers();

// migrateSubjects();

// migrateExams();

// migrateExams();

// migrateClasses();

// migrateHolidays();

// migrateTasks();