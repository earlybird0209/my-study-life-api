const express = require('express')
const router = express.Router();
const { Xtra } = require('../../../config/db');
const authMiddleware = require('../../../middlewares/authMiddleware').authMiddleware;
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { uploadImage, deleteImage } = require('../../../services/digital_ocean');
const crypto = require('crypto');
const moment = require('moment');
const { Op } = require("sequelize");


// Get my Xtras
router.get('/', authMiddleware, function(req, res) {
    
    let where = {
        userId: req.authUser.id,
    };

    if(req.query.filter) {

        let filter = req.query.filter;

        // if(filter == 'upcoming') {
        //     where.startDate = {
        //         [Op.gte]: moment().format('YYYY-MM-DD')
        //     };
        //
        // }
        // if(filter == 'past') {
        //     where.startDate = {
        //         [Op.lt]: moment().format('YYYY-MM-DD')
        //     };
        // }

        if(filter == 'academic') {
            where.eventType = 'academic';
        }

        if(filter == 'non-academic') {
            where.eventType = 'non-academic';
        }

    }

    Xtra.findAndCountAll({
        where,
        order: [
            ['id', 'DESC'],
        ],
    }).then(xtras => {
        
        if (xtras) {
            return res.status(200).json({
                count: xtras.count,
                xtras: xtras.rows,
            });
        }

        return res.status(404).json({
            message: 'Items not found'
        });

    });
});


// Get Xtra
router.get('/:id', authMiddleware, function(req, res) {
    
    Xtra.findByPk(req.params.id).then(myXtra => {
        
        if (myXtra) {

            return res.status(200).json({
                xtra: myXtra
            });
        }

        return res.status(404).json({
            message: 'Item not found'
        });

    });
});

// Create Xtra
router.post('/', [authMiddleware, upload.single("image")], function(req, res) {

    if(req.body.days) {
        var days = req.body.days.split(',');
    } else {
        var days = [];
    }

    Xtra.create({
        userId: req.authUser.id,
        name: req.body.name,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        eventType: req.body.eventType,
        occurs: req.body.occurs,
        days: days,
    }).then(myXtra => {

        if(req.file) {

            var fileName = crypto.randomBytes(16).toString('hex') + '.jpg';
            var fullName = 'xtras/' + req.authUser.id + '/' + fileName;
            var image = uploadImage(req.file.path, fullName);
    
            if(!image) {
                return res.status(500).json({
                    message: 'Image upload failed'
                });
            }
            
            myXtra.image = fileName;
            myXtra.save();

        }

        return res.status(200).json({
            message: 'Item created successfully',
            xtra: myXtra
        });
    }).catch(err => {
        console.log(err);
        return res.status(422).json({
            message: 'Failed to create Xtra',
            error: err
        });
    });
});

// Update Xtra
router.put('/:id', [authMiddleware, upload.single("image")], function(req, res) {

    try {
        Xtra.findByPk(req.params.id).then(myXtra => {
            if (myXtra) {

                if(req.body.name != null) {
                    myXtra.name = req.body.name;
                }

                if(req.body.startTime != null) {
                    myXtra.startTime = req.body.startTime;
                }

                if(req.body.endTime != null) {
                    myXtra.endTime = req.body.endTime;
                }

                if(req.body.startDate != null) {
                    myXtra.startDate = req.body.startDate;
                }

                if(req.body.eventType != null) {
                    myXtra.eventType = req.body.eventType;
                }

                if(req.body.occurs != null) {
                    myXtra.occurs = req.body.occurs;
                }

                if(req.body.days != null) {
                    var days = req.body.days.split(',');
                    myXtra.days = days;
                }

                myXtra.save();

                if(req.file) {

                    var fileName = crypto.randomBytes(16).toString('hex') + '.jpg';
                    var fullName = 'xtras/' + req.authUser.id + '/' + fileName;
                    var image = uploadImage(req.file.path, fullName);
            
                    if(!image) {
                        return res.status(500).json({
                            message: 'Image upload failed'
                        });
                    }
                    
                    myXtra.image = fileName;
                    myXtra.save();
                }

                return res.status(200).json({
                    message: 'Item updated successfully'
                });
            }

            return res.status(404).json({
                message: 'Item not found'
            });
        });
        
    } catch (error) {
        return res.status(422).json({
            message: 'Failed',
            error: error
        });
    }


});

// Delete Xtra
router.delete('/:id', authMiddleware, function(req, res) {

    Xtra.findByPk(req.params.id).then(myXtra => {
        if (myXtra) {
            // Delete image from digital ocean
            if(myXtra.image) {
                var key = 'xtras/' + req.authUser.id + '/' + myXtra.image;
                deleteImage(key);
            }

            myXtra.destroy();

            return res.status(200).json({
                message: 'Item deleted successfully'
            });
        }

        return res.status(404).json({
            message: 'Item not found'
        });
    });

});

module.exports = router
