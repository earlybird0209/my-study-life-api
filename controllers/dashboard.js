const express = require('express');
const router = express.Router();
const { User, Class, Exam, Task, Partnership } = require('../config/db');
const adminMiddleware = require('../middlewares/adminMiddleware').adminMiddleware;
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require('fs');
const { uploadImage } = require('../services/digital_ocean');
const crypto = require('crypto');
const { Op } = require("sequelize");


// middleware that is specific to this router
router.use((req, res, next) => {
//   console.log('Time: ', Date.now())
  next()
})

router.get("/", adminMiddleware, async (req, res) => {

    const UsersCount = await User.count();
    const classesCount = await Class.count();
    const examsCount = await Exam.count();
    const tasksCount = await Task.count();
    const studentsCount = await User.count({
        where: {
            role: 'student'
        }
    });

    const teachersCount = await User.count({
        where: {
            role: 'teacher'
        }
    });

    const partnership = await Partnership.findOne();

    // lastLoginAt count for last 7 days
    const lastLoginAtCount = await User.count({
        where: {
            lastLoginAt: {
                [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
            }
        }
    });

    // lastActiveAt count for last 7 days
    const lastActiveAtCount = await User.count({
        where: {
            lastActiveAt: {
                [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
            }
        }
    });

    // new users count for last 7 days
    const newUsersCount = await User.count({
        where: {
            createdAt: {
                [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
            }
        }
    });

    res.render('admin/dashboard/index', { UsersCount, studentsCount, teachersCount, classesCount, examsCount, tasksCount, partnership, lastLoginAtCount, lastActiveAtCount, newUsersCount });

});


// upload partnership post request
router.post('/partnership-image', [adminMiddleware, upload.single("file")], async (req, res) => {

    try {
        // Get first record of Partnership model
        const partnership = await Partnership.findOne();

        if(!partnership) {
            // partnership = Partnership.create();

            const partnership = Partnership.build({
                title: req.body.title,
                link: req.body.link
            });
            await partnership.save();
        }
        
        if(req.file) {
            var fileName = crypto.randomBytes(16).toString('hex') + '.jpg';
            var fullName = 'partnership-images/' + fileName;

            var image = await uploadImage(req.file.path, fullName);
            
            if(!image) {
                return res.status(500).json({
                    message: 'Image upload failed 1'
                });
            }

            partnership.image = fileName;
        }

        partnership.title = req.body.title;
        partnership.link = req.body.link;
        await partnership.save();
        
        // return to edit
        return res.redirect('/partnership-image/edit');

    } catch (error) {

        console.log(error);
        return res.status(500).json({
            message: 'Image upload failed 2'
        });

    }

});

// edit partnership page
router.get('/partnership-image/edit', adminMiddleware, async (req, res) => {

    const partnership = await Partnership.findOne();

    res.render('admin/partnerships/edit', { partnership });

});
    
module.exports = router


