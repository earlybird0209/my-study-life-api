const express = require('express')
const router = express.Router();
// const Task = require('../../../models/Task');
const { Task } = require('../../../config/db');
const authMiddleware = require('../../../middlewares/authMiddleware').authMiddleware;
const moment = require('moment');
const { Op } = require("sequelize");


// Get my tasks
router.get('/', authMiddleware, function(req, res) {
    
    let subjectId = null;
    let where = {
        userId: req.authUser.id,
    };

    if(req.query.subject) {
        subjectId = req.query.subject;
        where.subjectId = subjectId;
    }

    if(req.query.filter) {

        let filter = req.query.filter;

        if(filter == 'current') {
            where.dueDate = {
                [Op.gte]: moment().format('YYYY-MM-DD')
            };
            where.completedAt = null;
        }
        if(filter == 'past') {
            where.completedAt = {
                [Op.ne]: null
            };
        }
        if(filter == 'overdue') {
            where.dueDate = {
                [Op.lt]: moment().format('YYYY-MM-DD')
            };
            where.completedAt = null;
        }

    }

    Task.findAndCountAll({
        where,
        order: [
            ['id', 'DESC'],
        ],
        include: [
            {
                association: 'subject',
            },
            {
                
                association: 'exam',
            },
        ],
    }).then(tasks => {
        
        if (tasks) {
            return res.status(200).json({
                count: tasks.count,
                tasks: tasks.rows,
            });
        }

        return res.status(404).json({
            message: 'Task not found'
        });

    });
});


// Get Task
router.get('/:id', authMiddleware, function(req, res) {
    
    Task.findByPk(req.params.id, { include: [
        {
            association: 'subject',
        },
        {
            
            association: 'exam',
        },
    ]}
    ).then(myTask => {
        
        if (myTask) {

            return res.status(200).json({
                Task: myTask
            });
        }

        return res.status(404).json({
            message: 'Task not found'
        });

    });
});

// Create Task
router.post('/', authMiddleware, function(req, res) {

    var days = req.body.days.split(',');

    Task.create({
        userId: req.authUser.id,
        subjectId: req.body.subjectId,
        title: req.body.title,
        details: req.body.details,
        type: req.body.type,
        category: req.body.category,
        occurs: req.body.occurs,
        days: days,
        dueDate: req.body.dueDate,
        examId: req.body.examId,
        classId: req.body.classId,
        progress: req.body.progress,
        completedAt: req.body.completedAt,
    }).then(myTask => {
        return res.status(200).json({
            message: 'Task created successfully',
            Task: myTask
        });
    });
});

// Update Task
router.put('/:id', authMiddleware, function(req, res) {

    var days = req.body.days.split(',');

    Task.findByPk(req.params.id).then(myTask => {
        if (myTask) {
            myTask.subjectId = req.body.subjectId;
            myTask.title = req.body.title;
            myTask.details = req.body.details;
            myTask.type = req.body.type;
            myTask.category = req.body.category;
            myTask.occurs = req.body.occurs;
            myTask.days = days;
            myTask.dueDate = req.body.dueDate;
            myTask.examId = req.body.examId;
            myTask.classId = req.body.classId;
            myTask.progress = req.body.progress;
            myTask.completedAt = req.body.completedAt;
            
            myTask.save();

            return res.status(200).json({
                message: 'Task updated successfully'
            });
        }

        return res.status(404).json({
            message: 'Task not found'
        });
    });

});

// Delete Task
router.delete('/:id', authMiddleware, function(req, res) {

    Task.findByPk(req.params.id).then(myTask => {
        if (myTask) {
            myTask.destroy();

            return res.status(200).json({
                message: 'Task deleted successfully'
            });
        }

        return res.status(404).json({
            message: 'Task not found'
        });
    });

});

module.exports = router
