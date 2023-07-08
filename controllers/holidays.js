const express = require('express');
const router = express.Router();
const {Holiday} = require('../config/db');
const adminMiddleware = require('../middlewares/adminMiddleware').adminMiddleware;
const moment = require('moment');

// middleware that is specific to this router
router.use((req, res, next) => {
//   console.log('Time: ', Date.now())
    next()
})

router.get("/", adminMiddleware, async (req, res) => {

    const holidays = await Holiday.findAndCountAll({
        limit: 15,
        offset: 0,
        where: {}, // conditions
        order: [
            ['id', 'DESC'],
        ]
    });

    res.render('admin/holidays/list', {holidays: holidays.rows, count: holidays.count, moment});

});

router.get('/user/:userId', adminMiddleware, async (req, res) => {

    let page = req.query.page || 1;

    const limit = 12;
    const offset = (page - 1) * limit;

    const holidays = await Holiday.findAndCountAll({
        limit,
        offset,
        where: {
            userId: req.params.userId
        },
        order: [
            ['id', 'DESC'],
        ]
    });

    const totalPages = Math.ceil(holidays.count / limit);

    res.render('admin/holidays/list', {
        holidays: holidays.rows,
        count: holidays.count,
        totalPages,
        currentPage: page,
        moment,
        userId: req.params.userId
    });

});

router.get('/:id', adminMiddleware, async (req, res) => {
    const holiday = await Holiday.findByPk(req.params.id);
    res.render('admin/holidays/edit', {holiday, moment});
})

module.exports = router
