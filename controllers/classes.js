const express = require('express');
const router = express.Router();
const { Class, Subject } = require('../config/db');
const adminMiddleware = require('../middlewares/adminMiddleware').adminMiddleware;
const moment = require('moment');
const Sequelize = require('sequelize');


// middleware that is specific to this router
router.use((req, res, next) => {
//   console.log('Time: ', Date.now())
  next()
})

router.get("/", adminMiddleware, async (req, res) => {

    const classes = await Class.findAndCountAll({
        limit: 15,
        offset: 0,
        order: [['id', 'DESC']],
        include: [{
            select: ['subject'],
            model: Subject,
            as: 'subject'
        }]
    });
    
    res.render('admin/classes/list', { classes: classes.rows, count: classes.count, moment });

});

router.get('/user/:userId', adminMiddleware, async (req, res) => {

    let page = req.query.page || 1;

    const limit = 12;
    const offset = (page - 1) * limit;

    const classes = await Class.findAndCountAll({
        limit,
        offset,
        where: {
            userId: req.params.userId
        },
        order: [['id', 'DESC']],
        include: [{
            select: ['subject'],
            model: Subject,
            as: 'subject'
        }]
    });

    const totalPages = Math.ceil(classes.count / limit);

    res.render('admin/classes/list', { 
        classes: classes.rows, 
        count: classes.count,  
        totalPages,
        currentPage: page,
        moment,
        userId: req.params.userId,
    });

});

router.get('/:id', adminMiddleware, async (req, res) => {
    const classObject = await Class.findByPk(req.params.id);
    res.render('admin/classes/edit', { classObject, moment });
})

module.exports = router
