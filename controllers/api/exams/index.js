const express = require('express')
const router = express.Router();
const { Exam } = require('../../../config/db');
const authMiddleware = require('../../../middlewares/authMiddleware').authMiddleware;
const moment = require('moment');
const { Op } = require("sequelize");


// Get my exams
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
            where.startDate = {
                [Op.gte]: moment().format('YYYY-MM-DD')
            };

        }
        if(filter == 'past') {
            where.startDate = {
                [Op.lt]: moment().format('YYYY-MM-DD')
            };
        }

    }

    Exam.findAndCountAll({
        where,
        order: [
            ['id', 'DESC'],
        ],
        include: [
            {
                association: 'subject',
            },
        ]
    }).then(exams => {
        
        if (exams) {
            return res.status(200).json({
                count: exams.count,
                exams: exams.rows,
            });
        }

        return res.status(404).json({
            message: 'Exam not found'
        });

    });
});


// Get Exam
router.get('/:id', authMiddleware, function(req, res) {
    
    Exam.findByPk(req.params.id, {
        include: [
            {
                association: 'subject',
            },
        ]
    }).then(exam => {
        
        if (exam) {

            return res.status(200).json({
                Exam: exam
            });
        }

        return res.status(404).json({
            message: 'Exam not found'
        });

    });
});

// Create Exam
router.post('/', authMiddleware, function(req, res) {

    Exam.create({
        userId: req.authUser.id,
        subjectId: req.body.subjectId,
        resit: req.body.resit,
        type: req.body.type,
        module: req.body.module,
        mode: req.body.mode,
        room: req.body.room,
        seat: req.body.seat,
        startDate: req.body.startDate,
        startTime: req.body.startTime,
        duration: req.body.duration,
        onlineUrl: req.body.onlineUrl,

    }).then(exam => {
        return res.status(200).json({
            message: 'Exam created successfully',
            exam: exam
        });
    });
});

// Update Exam
router.put('/:id', authMiddleware, function(req, res) {

    var days = req.body.days.split(',');

    Exam.findByPk(req.params.id).then(exam => {
        if (exam) {
            exam.subject = req.body.subject;
            exam.resit = req.body.resit;
            exam.type = req.body.type;
            exam.module = req.body.module;
            exam.mode = req.body.mode;
            exam.room = req.body.room;
            exam.seat = req.body.seat;
            exam.startDate = req.body.startDate;
            exam.startTime = req.body.startTime;
            exam.duration = req.body.duration;
            exam.onlineUrl = req.body.onlineUrl;
            exam.save();

            return res.status(200).json({
                message: 'Exam updated successfully'
            });
        }

        return res.status(404).json({
            message: 'Exam not found'
        });
    });

});

// Delete Exam
router.delete('/:id', authMiddleware, function(req, res) {

    Exam.findByPk(req.params.id).then(exam => {
        if (exam) {
            exam.destroy();

            return res.status(200).json({
                message: 'Exam deleted successfully'
            });
        }

        return res.status(404).json({
            message: 'Exam not found'
        });
    });

});

module.exports = router
