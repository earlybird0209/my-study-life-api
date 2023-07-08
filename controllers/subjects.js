const express = require('express');
const router = express.Router();
const { Subject } = require('../config/db');
const adminMiddleware = require('../middlewares/adminMiddleware').adminMiddleware;
const moment = require('moment');

// middleware that is specific to this router
router.use((req, res, next) => {
//   console.log('Time: ', Date.now())
  next()
})

router.get("/", adminMiddleware, async (req, res) => {

    const subjects = await Subject.findAndCountAll({
        limit: 15,
        offset: 0,
        where: {}, // conditions
        order: [
            ['id', 'DESC'],
        ]
    });

    res.render('admin/subjects/list', { subjects: subjects.rows, count: subjects.count, moment });

});

router.get('/user/:userId', adminMiddleware, async (req, res) => {

    let page = req.query.page || 1;

    const limit = 12;
    const offset = (page - 1) * limit;

    const subjects = await Subject.findAndCountAll({
        limit,
        offset,
        where: {
            userId: req.params.userId
        },
        order: [
            ['id', 'DESC'],
        ]
    });

    const totalPages = Math.ceil(subjects.count / limit);

    res.render('admin/subjects/list', { 
        subjects: subjects.rows,
        count: subjects.count,
        totalPages,
        currentPage: page,
        moment,
        userId: req.params.userId
    });

});

router.get('/:id', adminMiddleware, async (req, res) => {
    const subject = await Subject.findByPk(req.params.id);
    res.render('admin/subjects/edit', { subject, moment });
})

module.exports = router
