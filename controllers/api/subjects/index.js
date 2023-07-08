const express = require('express')
const router = express.Router();
// const Subject = require('../../../models/Subject');
const { Subject } = require('../../../config/db');
const authMiddleware = require('../../../middlewares/authMiddleware').authMiddleware;
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require('fs');
const { uploadImage, deleteImage } = require('../../../services/digital_ocean');
const crypto = require('crypto');

// Get my Subjects
router.get('/', authMiddleware, function(req, res) {
    
    Subject.findAll({
        where: { userId: req.authUser.id }
    }).then(subjects => {
        
        if (subjects) {
            return res.status(200).json({
                subjects: subjects
            });
        }

        return res.status(404).json({
            message: 'Subject not found'
        });

    });
});


// Get Subject
router.get('/:id', authMiddleware, function(req, res) {
    
    Subject.findByPk(req.params.id).then(mySubject => {
        
        if (mySubject) {

            return res.status(200).json({
                subject: mySubject
            });
        }

        return res.status(404).json({
            message: 'Subject not found'
        });

    });
});

// Create Subject
router.post('/', [authMiddleware, upload.single("image")], function(req, res) {

    Subject.create({
        userId: req.authUser.id,
        subject: req.body.subject,
        color: req.body.color,
    }).then(mySubject => {

        if(req.file) {

            var fileName = crypto.randomBytes(16).toString('hex') + '.jpg';
            var fullName = 'subjects/' + req.authUser.id + '/' + fileName;
            var image = uploadImage(req.file.path, fullName);
    
            if(!image) {
                return res.status(500).json({
                    message: 'Image upload failed'
                });
            }
            
            mySubject.image = fileName;
            mySubject.save();
        }

        return res.status(200).json({
            message: 'Subject created successfully',
            subject: mySubject
        });

    }).catch(err => {
        return res.status(500).json({
            message: 'Subject creation failed',
            error: err
        });
    });

});

// Update Subject
router.put('/:id', [authMiddleware, upload.single("image")], function(req, res) {

    Subject.findByPk(req.params.id).then(mySubject => {
        if (mySubject) {
            mySubject.subject = req.body.subject;
            mySubject.color = req.body.color;
            mySubject.image = req.body.image;
            mySubject.save();

            if(req.file) {

                var fileName = crypto.randomBytes(16).toString('hex') + '.jpg';
                var fullName = 'subjects/' + req.authUser.id + '/' + fileName;
                var image = uploadImage(req.file.path, fullName);
        
                if(!image) {
                    return res.status(500).json({
                        message: 'Image upload failed'
                    });
                }
                
                mySubject.image = fileName;
                mySubject.save();
            }

            return res.status(200).json({
                message: 'Subject updated successfully'
            });
        }

        return res.status(404).json({
            message: 'Subject not found'
        });
    });

});

// Delete Subject
router.delete('/:id', authMiddleware, function(req, res) {

    Subject.findByPk(req.params.id).then(mySubject => {
        if (mySubject) {

            // Delete image from digital ocean
            if(mySubject.image) {
                var key = 'subjects/' + req.authUser.id + '/' + mySubject.image;
                deleteImage(key);
            }

            mySubject.destroy();

            return res.status(200).json({
                message: 'Subject deleted successfully'
            });
        }

        return res.status(404).json({
            message: 'Subject not found'
        });
    });

});

module.exports = router
