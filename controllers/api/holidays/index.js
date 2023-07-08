const express = require('express')
const router = express.Router();
// const Holiday = require('../../../models/Holiday');
const { Holiday } = require('../../../config/db');
const authMiddleware = require('../../../middlewares/authMiddleware').authMiddleware;
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require('fs');
const { uploadImage, deleteImage } = require('../../../services/digital_ocean');
const crypto = require('crypto');
const moment = require('moment');
const { Op } = require("sequelize");


// Get my Holidays
router.get('/', authMiddleware, function(req, res) {
    
    let where = {
        userId: req.authUser.id,
    };

    if(req.query.filter) {

        let filter = req.query.filter;

        if(filter == 'upcoming') {
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

    Holiday.findAndCountAll({
        where,
        order: [
            ['id', 'DESC'],
        ],
    }).then(holidays => {
        
        if (holidays) {
            return res.status(200).json({
                count: holidays.count,
                holidays: holidays.rows,
            });
        }

        return res.status(404).json({
            message: 'Holiday not found'
        });

    });
});


// Get Holiday
router.get('/:id', authMiddleware, function(req, res) {
    
    Holiday.findByPk(req.params.id).then(myHoliday => {
        
        if (myHoliday) {

            return res.status(200).json({
                holiday: myHoliday
            });
        }

        return res.status(404).json({
            message: 'Holiday not found'
        });

    });
});

// Create Holiday
router.post('/', [authMiddleware, upload.single("image")], function(req, res) {

    Holiday.create({
        userId: req.authUser.id,
        title: req.body.title,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
    }).then(myHoliday => {

        if(req.file) {

            var fileName = crypto.randomBytes(16).toString('hex') + '.jpg';
            var fullName = 'holidays/' + req.authUser.id + '/' + fileName;
            var image = uploadImage(req.file.path, fullName);
    
            if(!image) {
                return res.status(500).json({
                    message: 'Image upload failed'
                });
            }
            
            myHoliday.image = fileName;
            myHoliday.save();

        }

        return res.status(200).json({
            message: 'Holiday created successfully',
            holiday: myHoliday
        });
    }).catch(err => {
        console.log(err);
        return res.status(422).json({
            message: 'Failed to create holiday',
            error: err
        });
    });
});

// Update Holiday
router.put('/:id', [authMiddleware, upload.single("image")], function(req, res) {

    try {
        Holiday.findByPk(req.params.id).then(myHoliday => {
            if (myHoliday) {

                if(req.body.title != null) {
                    myHoliday.title = req.body.title;
                }

                if(req.body.startDate != null) {
                    myHoliday.startDate = req.body.startDate;
                }

                if(req.body.endDate != null) {
                    myHoliday.endDate = req.body.endDate;
                }

                myHoliday.save();

                if(req.file) {

                    var fileName = crypto.randomBytes(16).toString('hex') + '.jpg';
                    var fullName = 'holidays/' + req.authUser.id + '/' + fileName;
                    var image = uploadImage(req.file.path, fullName);
            
                    if(!image) {
                        return res.status(500).json({
                            message: 'Image upload failed'
                        });
                    }
                    
                    myHoliday.image = fileName;
                    myHoliday.save();
                }

                return res.status(200).json({
                    message: 'Holiday updated successfully'
                });
            }

            return res.status(404).json({
                message: 'Holiday not found'
            });
        });
        
    } catch (error) {
        return res.status(422).json({
            message: 'Failed',
            error: error
        });
    }


});

// Delete Holiday
router.delete('/:id', authMiddleware, function(req, res) {

    Holiday.findByPk(req.params.id).then(myHoliday => {
        if (myHoliday) {
            // Delete image from digital ocean
            if(myHoliday.image) {
                var key = 'holidays/' + req.authUser.id + '/' + myHoliday.image;
                deleteImage(key);
            }

            myHoliday.destroy();

            return res.status(200).json({
                message: 'Holiday deleted successfully'
            });
        }

        return res.status(404).json({
            message: 'Holiday not found'
        });
    });

});

module.exports = router
