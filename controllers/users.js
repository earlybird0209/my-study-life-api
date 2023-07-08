const express = require('express');
const router = express.Router();
const { User } = require('../config/db');
const adminMiddleware = require('../middlewares/adminMiddleware').adminMiddleware;
const moment = require('moment');
const { Op } = require("sequelize");
var crypto = require('crypto');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const { uploadImage } = require('../services/digital_ocean');
const { validateEmail } = require('../helpers/main');

// middleware that is specific to this router
router.use((req, res, next) => {
//   console.log('Time: ', Date.now())
  next()
})

router.get("/", adminMiddleware, async (req, res) => {

    let page = req.query.page || 1;
    let search = req.query.search || '';
    search = search.trim();

    const limit = 12;
    const offset = (page - 1) * limit;

    let where = {};

    if(search && search.length > 0) {

        if(!isNaN(search)) {

            search = parseInt(search);
            where = { id: search }

        } else {

            where = {
                [Op.or]: [
                    {
                        firstName: {
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        lastName: {
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        email: {
                            [Op.like]: `%${search}%`
                        }
                    }
                ]
            }

        }

        
    }


    const users = await User.findAndCountAll({
        limit,
        offset,
        where: where,
        order: [
            ['id', 'DESC'],
        ],
    });

    const totalPages = Math.ceil(users.count / limit);

    res.render('admin/users/list', { 
        users: users.rows,
        count: users.count,
        totalPages,
        currentPage: page,
        moment,
        search
    });

});

router.get('/:id', adminMiddleware, async (req, res) => {
    const user = await User.findByPk(req.params.id);
    res.render('admin/users/edit', { 
        user: user,
        queryParams: req.query,
        moment
     });
})

router.post('/:id', [adminMiddleware, upload.single("profileImage")], async (req, res) => {

    const user = await User.findByPk(req.params.id);

    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.role = req.body.role;
    user.isVerified = req.body.isVerified;

    if(req.body.email && user.email != req.body.email) {

        // validate email address with helper main 
        const emailIsValid = await validateEmail(req.body.email);

        if(!emailIsValid) {
            return res.redirect(`/users/${user.id}?messageDanger=Email ${req.body.email} is not valid`);
        }

        // check if email is already taken by another user
        const emailExists = await User.findOne({ where: { 
            email: req.body.email,
            id: { [Op.ne]: user.id }
        } });
        
        if(emailExists) {
            return res.redirect(`/users/${user.id}?messageDanger=Email ${req.body.email} already exists`);
        }

        user.email = req.body.email;
    }

    if(req.body.password && req.body.password.length > 0) {

        if(!user.salt) {
            var salt = crypto.randomBytes(16).toString('hex');
            user.salt = salt;
        }
        
        var hashed = crypto.pbkdf2Sync(req.body.password, user.salt, 310000, 32, 'sha256').toString('hex');
        user.password = hashed;
        
    }

    await user.save();

    if(req.file) {
        
        // make variable for fileName with random string
        var fileName = crypto.randomBytes(16).toString('hex') + '.jpg';
        var fullName = user.id + '/' + fileName;
        var image = await uploadImage(req.file.path, fullName);

        if(!image) {
            return res.status(500).json({
                message: 'Image upload failed'
            });
        }
        
        // unlink file from server
        // fs.unlink(pathToImage, (err) => {
        //     if (err) {
        //         console.error(err);
        //         return;
        //     }
        //     console.log('File deleted successfully');
        // });
        

        user.profileImage = fileName;
        user.save();
    }

    res.redirect('/users/'+ user.id +'?message=User updated successfully');


})

// Delete user
router.post('/:id/delete', adminMiddleware, async (req, res) => {
    const user = await User.findByPk(req.params.id);
    // soft delete
    user.deletedAt = new Date();
    user.status = 'deleted';
    await user.save();

    res.redirect('/users?message=User deleted successfully');
})

module.exports = router
