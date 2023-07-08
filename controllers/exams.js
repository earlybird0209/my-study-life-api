const express = require('express');
const router = express.Router();
const { Exam, Subject } = require('../config/db');
const adminMiddleware = require('../middlewares/adminMiddleware').adminMiddleware;
const moment = require('moment');

// middleware that is specific to this router
router.use((req, res, next) => {
//   console.log('Time: ', Date.now())
  next()
})

router.get("/", adminMiddleware, async (req, res) => {

    const exams = await Exam.findAndCountAll({
        limit: 15,
        offset: 0,
        where: {}, // conditions
        order: [
            ['id', 'DESC'],
        ]
    });

    res.render('admin/exams/list', { exams: exams.rows, count: exams.count, moment });

});

router.get('/user/:userId', adminMiddleware, async (req, res) => {

    let page = req.query.page || 1;

    const limit = 12;
    const offset = (page - 1) * limit;

    const exams = await Exam.findAndCountAll({
        limit,
        offset,
        where: {
            userId: req.params.userId
        },
        order: [
            ['id', 'DESC'],
        ],
        include: [{
            select: ['subject'],
            model: Subject,
            as: 'subject'
        }]
    });

    const totalPages = Math.ceil(exams.count / limit);

    res.render('admin/exams/list', { 
        exams: exams.rows,
        count: exams.count,
        totalPages,
        currentPage: page,
        moment,
        userId: req.params.userId
    });

});

router.get('/:id', adminMiddleware, async (req, res) => {
    const exam = await Exam.findByPk(req.params.id);
    res.render('admin/exams/edit', { exam, moment });
})

module.exports = router
