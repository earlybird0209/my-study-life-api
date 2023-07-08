const jwt = require('jsonwebtoken');
const { User } = require('../config/db');

exports.authMiddleware = function authMiddleware(req, res, next){

    var token = req.headers.authorization;
    if(!token) return res.status(401).json({message: 'No token provided.'});
    
    token = token.replace("Bearer ", "");

    if (token) {
        jwt.verify(token, '8c344712f850c098655c152d37d1e3f5', (err, decoded) => {

            if (err) {
            
            return res.status(401).json({
                status: 'error',
                message: 'Token is not valid'
            });

            }
            
            req.authUser = decoded;
          
            // Check if authUser exists
            User.findOne({
                where: { id: req.authUser.id }
            }).then(user => {

                if (user && user.status != 'deleted') {
                    return next();
                }

                return res.status(404).json({
                    message: 'User not found'
                });

            });
          
        });

    } else {

        return res.status(401).json({
            status: 'error',
            message: 'Token not provided'
        });
        
    }
    
}
