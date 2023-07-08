const express = require('express');
const router = express.Router();
const { User } = require('../config/db');
const adminMiddleware = require('../middlewares/adminMiddleware').adminMiddleware;

// middleware that is specific to this router
router.use((req, res, next) => {
//   console.log('Time: ', Date.now())
  next()
})

router.get("/login", async (req, res) => {

    if(req.session.user) return res.redirect('/');

    return res.render('auth/login');

});

router.post('/login', async (req, res) => {
    
    let user = null;
    try {
        user = await User.findOne({ where: { email: req.body.email } });
    } catch (error) {
        console.log(error);
        return res.render('auth/login', { error: 'User not found' });
    }

    if (!user) {
        return res.render('auth/login', { error: 'User not found' });
    } else {
        if (user.comparePassword(req.body.password)) {
            req.session.user = user;
            return res.redirect('/');
        } else {
            return res.render('auth/login', { error: 'Wrong password' });
        }
    }
});

router.get("/logout", async (req, res) => {

    if(req.session.user) {
        req.session.user = null;
    }
    
    return res.redirect('/login');

});

module.exports = router
