const express = require('express');
const router = express.Router();
const { Task, Subject } = require('../config/db');
const adminMiddleware = require('../middlewares/adminMiddleware').adminMiddleware;
const moment = require('moment');

// middleware that is specific to this router
router.use((req, res, next) => {
//   console.log('Time: ', Date.now())
  next()
})

router.get("/", adminMiddleware, async (req, res) => {

    const tasks = await Task.findAndCountAll({
        limit: 15,
        offset: 0,
        where: {}, // conditions
        order: [
            ['id', 'DESC'],
        ]
    });

    res.render('admin/tasks/list', { tasks: tasks.rows, count: tasks.count, moment });

});

router.get('/user/:userId', adminMiddleware, async (req, res) => {

    let page = req.query.page || 1;

    const limit = 12;
    const offset = (page - 1) * limit;

    const tasks = await Task.findAndCountAll({
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

    const totalPages = Math.ceil(tasks.count / limit);

    res.render('admin/tasks/list', { 
        tasks: tasks.rows,
        count: tasks.count,
        totalPages,
        currentPage: page,
        moment,
        userId: req.params.userId
    });

});

router.get('/:id', adminMiddleware, async (req, res) => {
    const task = await Task.findByPk(req.params.id);
    console.log(task.days);
    res.render('admin/tasks/edit', { task, moment });
})

module.exports = router
