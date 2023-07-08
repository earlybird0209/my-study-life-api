const jwt = require('jsonwebtoken');


exports.adminMiddleware = function adminMiddleware(req, res, next){

    var authUser = req.session.user;
    authUserObject = authUser;

    if(!authUser) return res.redirect('/login');

    if (authUser.role == 'admin') {
        next();
    } else {
        // return res.redirect('/login');
        req.session.user = null;
        res.render('auth/login', { error: 'You are not admin' });
    }

}
