const express = require('express')
const router = express.Router();
var passport = require('passport');
// var LocalStrategy = require('passport-local');
var crypto = require('crypto');
const { exit } = require('process');
const { User, Class, Task, Exam, Subject, db } = require('../../../config/db');
const authMiddleware = require('../../../middlewares/authMiddleware').authMiddleware;
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require('fs');
const { uploadImage } = require('../../../services/digital_ocean');
const { Op } = require("sequelize");
const moment = require('moment');


// Get user profile
router.get('/', authMiddleware, function(req, res) {
    
    User.scope('withoutPassword').findByPk(req.authUser.id).then(user => {
        if (user) {
            // get full path of profile image
            // if (user.profileImage) {
            //     user.profileImage = 'https://' + process.env.DIGITAL_OCEAN_SPACES_ENDPOINT + '/' + process.env.DIGITAL_OCEAN_BUCKET + '/' + user.id + '/' + user.profileImage;
            // }

            user.lastActiveAt = new Date();
            user.save();
            
            return res.status(200).json({
                user: user
            });
        }

        return res.status(404).json({
            message: 'User not found'
        });
    });
});

// Update user profile
router.put('/', authMiddleware, function(req, res) {
    User.findByPk(req.authUser.id).then(user => {
        if (user) {

            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.save();

            if(req.body.email) {
                if (req.body.email.toLowerCase() != user.email.toLowerCase()) {

                    // check if email already exists
                    User.findOne({
                        where: {
                            email: req.body.email.toLowerCase()
                        }
                    }).then(user2 => {

                        if (user2) {
                            return res.status(400).json({
                                message: 'Email already exists'
                            });
                        } else {
                            user.email = req.body.email.toLowerCase();
                            user.save();
                            return res.status(200).json({
                                message: 'User updated successfully'
                            });
                        }
                    });
                } else {
                    return res.status(200).json({
                        message: 'User updated successfully'
                    });
                }
            } else {
                return res.status(200).json({
                    message: 'User updated successfully'
                });
            }

        } else {
            return res.status(404).json({
                message: 'User not found'
            });
        }
    }).catch(error => {
        console.error(error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    });
});


// Update user password
router.put('/password', authMiddleware, function(req, res) {
    User.findByPk(req.authUser.id).then(user => {
        if (user) {
            if(!user.salt) {
                var salt = crypto.randomBytes(16).toString('hex');
                user.salt = salt;
            }

            // Validate password
            if (!user.comparePassword(req.body.oldPassword)) return res.status(401).json({message: 'Invalid email or password'});

            var hashed = crypto.pbkdf2Sync(req.body.newPassword, user.salt, 310000, 32, 'sha256').toString('hex');
            user.password = hashed;
            user.save();

            return res.status(200).json({
                message: 'Password updated successfully'
            });
        }

        return res.status(404).json({
            message: 'User not found'
        });
    });
});

// Update user email
router.put('/email', authMiddleware, function(req, res) {
    User.findByPk(req.authUser.id).then(user => {
        if (user) {

            if(req.body.email) {
                if (req.body.email.toLowerCase() != user.email.toLowerCase()) {

                    // check if email already exists
                    User.findOne({
                        where: {
                            email: req.body.email.toLowerCase()
                        }
                    }).then(user2 => {

                        if (user2) {
                            return res.status(400).json({
                                message: 'Email already exists'
                            });
                        } else {

                            // check password
                            if(req.body.password) {
                                if (!user.comparePassword(req.body.password)) return res.status(401).json({message: 'Invalid password'});
                            } else {
                                return res.status(400).json({
                                    message: 'Password is required'
                                });
                            }

                            user.email = req.body.email.toLowerCase();
                            user.save();
                            return res.status(200).json({
                                message: 'Email updated successfully'
                            });
                        }
                    });
                } else {
                    return res.status(200).json({
                        message: 'Email updated successfully'
                    });
                }
            } else {
                return res.status(400).json({
                    message: 'Email is required'
                });
            }

        } else {
            return res.status(404).json({
                message: 'User not found'
            });
        }

    });
});

// Delete user
router.delete('/', authMiddleware, function(req, res) {
    User.findByPk(req.authUser.id)
        .then(user => {
            if (user) {
                // Delete image from digital ocean
                if (user.profileImage) {
                    var key = req.authUser.id + '/' + user.profileImage;
                    deleteImage(key);
                }

                // random hash
                var hash = crypto.randomBytes(6).toString('hex');

                // Delete the user and handle the promise
                user.deletedAt = new Date();
                user.status = 'deleted';
                user.email = user.id + '-' + hash + '-' + user.email;
                user.firstName = 'removed';
                user.lastName = 'removed';
                user.save()

                return res.status(200).json({
                    message: 'User deleted successfully'
                });

            } else {
                return res.status(404).json({
                    message: 'User not found'
                });
            }
        })
        .catch(err => {
            return res.status(500).json({
                message: 'An error occurred while finding the user',
                error: err
            });
        });
});

// upload user profile image
router.post('/profile-image', [authMiddleware, upload.single("image")], function(req, res) {
    User.findByPk(req.authUser.id).then(user => {
        if (user) {

            if(!req.file) {
                return res.status(400).json({
                    message: 'No image provided'
                });
            }

            // make variable for fileName with random string
            var fileName = crypto.randomBytes(16).toString('hex') + '.jpg';
            var fullName = user.id + '/' + fileName;
            var image = uploadImage(req.file.path, fullName);

            if(!image) {
                return res.status(500).json({
                    message: 'Image upload failed'
                });
            }

            console.log(fileName);
            user.profileImage = fileName;
            user.save();

            // fs.unlink(req.file.path, (err) => {
            //     if (err) {
            //         console.error(err)
            //     }
            // });
            
            return res.status(200).json({
                message: 'Image updated successfully'
            });
        }

        return res.status(404).json({
            message: 'User not found'
        });

    });
});

router.get('/home', authMiddleware, async function(req, res) {

    // Get count of classes, exams and tasks due for this week

    var today = new Date();
    var startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    var endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);

    // console.log(startOfWeek, endOfWeek);
    // return 'test';

    var classes = 0;
    var repeatingClasses = 0;
    var exams = 0;
    var tasks = 0;

    classes = await Class.findAndCountAll({
        where: {
            userId: req.authUser.id,
            occurs: 'once',
            startDate: {
                [Op.between]: [startOfWeek, endOfWeek]
            }
        },
        include: [
            {
                model: Subject,
                as: 'subject'
            },
            {
                model: Task,
                as: 'tasks',
                // where: {
                //     dueDate: {
                //         [Op.gte]: new Date()
                //     }
                // }
            }
        ],
        sort: [
            ['startDate', 'ASC']
        ]
    }).then(data => {
        return data;
    });

    // add repeating classes
    repeatingClasses = await Class.findAndCountAll({
        distinct: true,
        where: {
            userId: req.authUser.id,
            occurs: 'repeating'
        },
        include: [
            {
                model: Subject,
                as: 'subject'
            },
            {
                model: Task,
                as: 'tasks',
            }
        ],
    }).then(data => {
        return data;
    });

    // console.log(classes.count, repeatingClasses.count);
    // console.log(repeatingClasses);

    classes.count += repeatingClasses.count;
    classes.rows = classes.rows.concat(repeatingClasses.rows);


    exams = await Exam.findAndCountAll({
        where: {
            userId: req.authUser.id,
            startDate: {
                [Op.between]: [startOfWeek, endOfWeek]
            }
        },
        include: [
            {
                model: Subject,
                as: 'subject'
            }
        ]
    }).then(data => {
        return data;
    });

    tasks = await Task.findAndCountAll({
        where: {
            userId: req.authUser.id,
            dueDate: {
                [Op.between]: [startOfWeek, endOfWeek]
            }
        },
        include: [
            {
                model: Subject,
                as: 'subject'
            }
        ]
    }).then(data => {
        return data;
    });

    let newClasses = [];
    // set badge for upcoming classes
    classes.rows.forEach(function(classItem) {
        let classDate = new Date(classItem.dataValues.startDate);
        let now = new Date();

        if(classDate > now) {
            classItem.dataValues.upNext = true;
        } else {
            classItem.dataValues.upNext = false;
        }

        // console.log(classItem.dataValues.startDate);

        newClasses.push(classItem);
    });

    return res.status(200).json({
        classesCount: classes.count,
        examsCount: exams.count,
        tasksCount: tasks.count,
        classes: newClasses,
        exams: exams.rows,
        tasks: tasks.rows,
    });

});


// get calendar events between two dates
router.get('/calendar', authMiddleware, async function(req, res) {

    // get start and end dates from query
    var startDate = new Date(req.query.startDate);
    var endDate = new Date(req.query.endDate);

    // date difference in days
    var diffTime = Math.abs(endDate - startDate);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // find which days of the week are selected
    var days = [];
    for(var i = 0; i <= diffDays; i++) {
        var day = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);

        day = day.toLocaleString('en-us', {  weekday: 'short' }).toLowerCase();

        if(!days.includes(day)) {
            days.push(day);
        }
    }

    if(startDate == 'Invalid Date' || endDate == 'Invalid Date') {
        return res.status(400).json({
            message: 'Invalid dates'
        });
    }

    var classes = await Class.findAll({
        where: {
            userId: req.authUser.id,
            occurs: 'once',
            startDate: {
                [Op.between]: [startDate, endDate]
            }
        },
        include: [
            {
                model: Subject,
                as: 'subject'
            },
        ],
    });

    // Check days for repeating classes
    console.log(days);
    var repeatingClasses = await Class.findAll({
        where: {
            userId: req.authUser.id,
            occurs: 'repeating',
            days: {
                [Op.overlap]: days
            }
        },
        include: [
            {
                model: Subject,
                as: 'subject'
            },
        ],
    });

    var exams = await Exam.findAll({
        where: {
            userId: req.authUser.id,
            startDate: {
                [Op.between]: [startDate, endDate]
            }
        },
        include: [
            {
                model: Subject,
                as: 'subject'
            },
        ],
    });

    var tasks = await Task.findAll({
        where: {
            userId: req.authUser.id,
            dueDate: {
                [Op.between]: [startDate, endDate]
            }
        },
        include: [
            {
                model: Subject,
                as: 'subject'
            },
        ],
    });

    // create array of events
    var events = [];

    // add classes to events
    for(var i = 0; i < classes.length; i++) {
        var event = {
            eventType: 'class',
            id: classes[i].id,
            subject: classes[i].subject,
            module: classes[i].module,
            mode: classes[i].mode,
            room: classes[i].room,
            building: classes[i].building,
            onlineUrl: classes[i].onlineUrl,
            teacher: classes[i].teacher,
            teachersEmail: classes[i].teachersEmail,
            occurs: classes[i].occurs,
            days: classes[i].days,
            startDate: classes[i].startDate,
            endDate: classes[i].endDate,
            startTime: classes[i].startTime,
            endTime: classes[i].endTime,
            createdAt: classes[i].createdAt,
        };

        events.push(event);
    }

    // add repeating classes to events
    for(var i = 0; i < repeatingClasses.length; i++) {
        var event = {
            eventType: 'class',
            id: repeatingClasses[i].id,
            subject: repeatingClasses[i].subject,
            module: repeatingClasses[i].module,
            mode: repeatingClasses[i].mode,
            room: repeatingClasses[i].room,
            building: repeatingClasses[i].building,
            onlineUrl: repeatingClasses[i].onlineUrl,
            teacher: repeatingClasses[i].teacher,
            teachersEmail: repeatingClasses[i].teachersEmail,
            occurs: repeatingClasses[i].occurs,
            days: repeatingClasses[i].days,
            startDate: repeatingClasses[i].startDate,
            endDate: repeatingClasses[i].endDate,
            startTime: repeatingClasses[i].startTime,
            endTime: repeatingClasses[i].endTime,
            createdAt: repeatingClasses[i].createdAt,
        };
        events.push(event);
    }

    // add exams to events
    for(var i = 0; i < exams.length; i++) {
        var event = {
            eventType: 'exam',
            id: exams[i].id,
            subject: exams[i].subject,
            resit: exams[i].resit,
            type: exams[i].type,
            module: exams[i].module,
            mode: exams[i].mode,
            onlineUrl: exams[i].onlineUrl,
            room: exams[i].room,
            seat: exams[i].seat,
            startDate: exams[i].startDate,
            startTime: exams[i].startTime,
            duration: exams[i].duration,
            createdAt: exams[i].createdAt,
        };
        events.push(event);
    }

    // add tasks to events
    for(var i = 0; i < tasks.length; i++) {
        var event = {
            eventType: 'task',
            id: tasks[i].id,
            subject: tasks[i].subject,
            details: tasks[i].details,
            type: tasks[i].type,
            dueDate: tasks[i].dueDate,
            progress: tasks[i].progress,
            category: tasks[i].category,
            occurs: tasks[i].occurs,
            days: tasks[i].days,
            completedAt: tasks[i].completedAt,
            createdAt: tasks[i].createdAt
        };
        events.push(event);
    }

    return res.status(200).json({
        events: events
    });

})


module.exports = router
