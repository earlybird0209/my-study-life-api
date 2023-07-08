// Import the postgres client
const express = require("express");
const cors = require('cors');
var ejs = require('ejs');
var bodyParser = require('body-parser');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const router = express.Router()


const app = express();
const port = 8080;
app.use(cors());

const session = require('express-session');
var authUserObject = null;

dotenv.config();
app.use(session({ secret: 'SECRET' }));
app.use(passport.initialize())
app.use(passport.session())

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

// db connection
const sequelize = require('./config/db');

// ADMIN DASHBOARD
const auth = require('./controllers/auth');
const Users = require('./controllers/users');
const dashboard = require('./controllers/dashboard');
const classes = require('./controllers/classes');
const exams = require('./controllers/exams');
const tasks = require('./controllers/tasks');
const subjects = require('./controllers/subjects');
const holidays = require('./controllers/holidays');


app.use('/', auth);
app.use('/users', Users);
app.use('/classes', classes);
app.use('/exams', exams);
app.use('/tasks', tasks);
app.use('/subjects', subjects);
app.use('/holidays', holidays);


app.use('/', dashboard);
// END ADMIN DASHBOARD



// API
const apiAuth = require('./controllers/api/auth');
const apiUser = require('./controllers/api/users');
const apiClass = require('./controllers/api/classes');
const apiExam = require('./controllers/api/exams');
const apiTask = require('./controllers/api/tasks');
const apiSubject = require('./controllers/api/subjects');
const apiHoliday = require('./controllers/api/holidays');
const apiXtra = require('./controllers/api/xtras');


app.use('/api/auth', apiAuth);
app.use('/api/user', apiUser);
app.use('/api/class', apiClass);
app.use('/api/exam', apiExam);
app.use('/api/task', apiTask);
app.use('/api/subject', apiSubject);
app.use('/api/holiday', apiHoliday);
app.use('/api/xtra', apiXtra);
// END API


(async () => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
})();
