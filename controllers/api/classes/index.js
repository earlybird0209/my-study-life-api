const express = require('express')
const router = express.Router();
const { Class, Subject } = require('../../../config/db');
const authMiddleware = require('../../../middlewares/authMiddleware').authMiddleware;


// Get my classes
router.get('/', authMiddleware, function(req, res) {
    
    let subjectId = null;
    let where = {
        userId: req.authUser.id,
    };

    if(req.query.subject) {
        subjectId = req.query.subject;
        where.subjectId = subjectId;
    }

    Class.findAndCountAll({
        where,
        order: [
            ['id', 'DESC'],
        ],
        include: [
            {
                association: 'subject',
            },
            {
                association: 'tasks',
            },
        ],
    }).then(classes => {
        
        if (classes) {
            return res.status(200).json({
                count: classes.count,
                classes: classes.rows,
            });
        }

        return res.status(404).json({
            message: 'Class not found'
        });

    });
});


// Get class
router.get('/:id', authMiddleware, function(req, res) {
    
    Class.findByPk(req.params.id, {
        include: [
            {
                association: 'subject',
            },
            {
                association: 'tasks',
            },
        ],
    }).then(myClass => {
        
        if (myClass) {

            return res.status(200).json({
                class: myClass
            });
        }

        return res.status(404).json({
            message: 'Class not found'
        });

    });
});

// Create class
router.post('/', authMiddleware, async function(req, res) {

    var days = req.body.days ? req.body.days.split(',') : [];

    // check if subject id exists
    let subject = await Subject.findOne({where: { id: req.body.subjectId, userId: req.authUser.id }});

    if(!subject) {
        return res.status(404).json({
            message: 'Subject not found'
        });
    }

    Class.create({
        subjectId: req.body.subjectId,
        userId: req.authUser.id,
        module: req.body.module,
        mode: req.body.mode,
        room: req.body.room,
        building: req.body.building,
        teacher: req.body.teacher,
        occurs: req.body.occurs,
        days: days,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        createdAt: new Date(),
    }).then(myClass => {
        return res.status(200).json({
            message: 'Class created successfully',
            class: myClass
        });
    });
    
});

// Update class
router.put('/:id', authMiddleware, function(req, res) {

    var days = req.body.days.split(',');

    Class.findByPk(req.params.id).then(myClass => {
        if (myClass) {
            myClass.subject = req.body.subject;
            myClass.module = req.body.module;
            myClass.mode = req.body.mode;
            myClass.room = req.body.room;
            myClass.building = req.body.building;
            myClass.teacher = req.body.teacher;
            myClass.occurs = req.body.occurs;
            myClass.days = days;
            myClass.startDate = req.body.startDate;
            myClass.endDate = req.body.endDate;
            myClass.startTime = req.body.startTime;
            myClass.endTime = req.body.endTime;
            myClass.save();

            return res.status(200).json({
                message: 'Class updated successfully'
            });
        }

        return res.status(404).json({
            message: 'Class not found'
        });
    });

});

// Delete class
router.delete('/:id', authMiddleware, function(req, res) {

    Class.findByPk(req.params.id).then(myClass => {
        if (myClass) {
            myClass.destroy();

            return res.status(200).json({
                message: 'Class deleted successfully'
            });
        }

        return res.status(404).json({
            message: 'Class not found'
        });
    });

});

module.exports = router
