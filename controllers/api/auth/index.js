const express = require('express');
const router = express.Router();
var passport = require('passport');
// var LocalStrategy = require('passport-local');
var crypto = require('crypto');
const { exit } = require('process');
// const User = require('../../../models/User');
const { User, UserSocialLogins } = require('../../../config/db');
const { db } = require('../../../config/db');
var GoogleStrategy = require('passport-google-oidc');
const sendgrid = require('../../../services/sendgrid');
const Subject = require('../../../models/Subject');
const { createSubjects } = require('../../../helpers/main');

router.post('/sign-up', function(req, res, next) {
    
    var salt = crypto.randomBytes(16).toString('hex');

    if(!req.body.email || !req.body.password) {
        return res.status(400).send(
            {
            'message': 'You need a email and password',
            'status': 400
            }
        );
    }

    var hashed = crypto.pbkdf2Sync(req.body.password, salt, 310000, 32, 'sha256').toString('hex');
    var email = req.body.email.toLowerCase();

    // Check if email exists already
    User.findOne({ where: {
        email: email
    }})
        .then(user => {

            if (user) {
                return res.status(400).send({
                    'message': 'Email already exists',
                    'status': 400
                });
            }

            User.create({
                firstName: req.body.first_name,
                lastName: req.body.last_name,
                email,
                password: hashed,
                salt: salt,
                createdAt: new Date(),
                updatedAt: new Date()
            }).then(user => {
                // send email
                const code = crypto.randomBytes(16).toString('hex');
                const to = user.email;
                const subject = 'MyStudyLife Verification';
                const text = 'Please click on the link below to activate your account: <br> <a href="' + process.env['APP_URL'] + '/api/auth/account-verification/' + code + '">' + process.env['APP_URL'] + '/api/auth/account-verification/' + code + '</a>';

                user.verificationCode = code;
                user.save();

                sendgrid.sendEmail(to, subject, text);

                // Create default subjects
                createSubjects(user.id);

                return res.status(200).send({
                    'message': 'Please check your email for the verification code',
                    'status': 200
                });
            }).catch(err => {
                return res.status(400).send({
                    'message': 'User cannot be created',
                    'status': 400,
                    // 'error': err
                });
            });
        })
        .catch(err => {
            // Handle any errors that occur during the User.findOne() call
            return res.status(500).send({
                'message': 'An error occurred while checking the email',
                'status': 500
            });
        });

});


router.post('/login', async (req, res, next) => {

        User.findOne({
            where: {
                email: req.body.email.toLowerCase()
            }
        })
        .then(user => {

            if (!user) return res.status(401).json({message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});

            if(user.provider !== null) {
                return res.status(401).json({message: 'You have signed up with ' + user.provider + '. Please login with ' + user.provider + '.'});
            }

            // Validate password
            if (!user.comparePassword(req.body.password)) return res.status(401).json({message: 'Invalid email or password'});
             
            // Make sure the user has been verified
            if (!user.isVerified) return res.status(401).json({message: 'Your account has not been verified.'});

            // Update lastLogin
            user.lastLoginAt = new Date();
            user.save();

            // Login successful, write token, and send back to user
            res.status(200).json({
                message: 'success',
                token: user.generateJWT(), 
                user: user
            });
        })
        .catch(err => res.status(500).json({message: err.message}));

    }
);

// refresh token
router.post('/refresh-token', async (req, res, next) => {

    if(req.body.refreshToken == null) return res.status(401).json({msg: 'The refresh token is not valid.'});

    User.findOne({
        where: {refreshToken: req.body.refreshToken}
    })
    .then(user => {

        if (!user) return res.status(401).json({msg: 'The refresh token is not valid.'});

        // check if token is expired
        if (user.refreshTokenExpiryDate < new Date()) return res.status(401).json({msg: 'The refresh token is expired.'});

        // Login successful, write token, and send back user
        res.status(200).json({
            message: 'success', 
            token: user.generateJWT(),
        });

    })
    .catch(err => res.status(500).json({message: err.message}));

});


// resend verification code
router.post('/resend-verification-code', async (req, res, next) => {

    User.findOne({
        where: {email: req.body.email}
    })
    .then(user => {
        
        if (!user) return res.status(401).json({msg: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});
        
        // check if user is already verified
        if (user.isVerified) {

            if (req.query.isAdmin) {
                return res.redirect(process.env['APP_URL'] + '/users/' + user.id + '?message=The email address ' + req.body.email + ' is already verified.');
            }
            
            return res.status(401).json({msg: 'The email address ' + req.body.email + ' is already verified.'});
            
        }

        // send email
        const code = crypto.randomBytes(16).toString('hex');
        const to = user.email;
        const subject = 'MyStudyLife Verification';
        const text = 'Please click on the link below to activate your account: <br> <a href="' + process.env['APP_URL'] + '/api/auth/account-verification/' + code + '">' + process.env['APP_URL'] + '/api/auth/account-verification/' + code + '</a>';

        user.verificationCode = code;
        user.save();

        sendgrid.sendEmail(to, subject, text);

        if (req.query.isAdmin) {
            // redirect to admin page
            res.redirect(process.env['APP_URL'] + '/users/' + user.id + '?message=Email is sent to ' + user.email + ' with account verification link');
        } else {
            res.status(200).send(
                {
                'message': 'Please check your email for verification code',
                'status': 200
                }
            );
        }

    })
    .catch(err => res.status(500).json({message: err.message}));

}
);


// router.post('/verify-code', async (req, res, next) => {
    
//     User.findOne({
//         where: {email: req.body.email}
//     })
//     .then(user => {
        
//         if (!user) return res.status(401).json({msg: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});
        
//         // check if user is already verified
//         if (user.isVerified) return res.status(401).json({msg: 'The email address ' + req.body.email + ' is already verified.'});


//         if (user.verificationCode == req.body.code) {
//             user.isVerified = true;
//             user.save();
//             res.status(200).send(
//                 {
//                 'message': 'Account verified',
//                 'status': 200
//                 }
//             );
//         } else {
//             res.status(400).send(
//                 {
//                 'message': 'Invalid code',
//                 'status': 400
//                 }
//             );
//         }

//     })
//     .catch(err => res.status(500).json({message: err.message}));

// }
// );


// forgot password endpoint


router.post('/forgot-password', async (req, res, next) => {

    User.findOne({
        where: {email: req.body.email}
    })
    .then(user => {

        if (!user) return res.status(401).json({msg: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});

        // send email
        const code = Math.floor(100000 + Math.random() * 900000);
        const to = user.email;
        const subject = 'MyStudyLife Password Reset';
        const text = 'Your password reset link is: <br> <a href="' + process.env['APP_URL'] + '/api/auth/reset-password/' + user.id + '-' + user.salt + '">Reset Password</a>';

        user.passwordResetCode = code;
        user.save();
        
        sendgrid.sendEmail(to, subject, text);

        // check query parameter isAdmin
        if (req.query.isAdmin) {
            // redirect to admin page
            return res.redirect(process.env['APP_URL'] + '/users/' + user.id + '?message=Email is sent to ' + user.email + ' with password reset link');
        }
        
        return res.status(200).send(
            {
            'message': 'Please check your email for password reset code',
            'status': 200
            }
        );

    })
    .catch(err => res.status(500).json({message: err.message}));

}
);


// create new endpoint for password reset which receives the user id and salt
router.get('/reset-password/:id', async (req, res, next) => {

    // explode the id and salt
    const id = req.params.id.split('-')[0];
    const salt = req.params.id.split('-')[1];

    console.log(id, salt);

    User.findOne({
        where: {id, salt}
    })
    .then(user => {

        if (!user) return res.status(401).json({msg: 'The link is wrong, please try again.'});

        // show the password reset form view
        res.render('auth/reset-password', { user: user });
        
    })
    .catch(err => {
        res.render('error/404', { message: 'The link is wrong, please try again.' });
    });

}
);

router.post('/reset-password/update', async (req, res, next) => {

    const salt = req.body.salt;
    const id = req.body.id;

    // check if password is sent
    if (!req.body.password) {
        return res.status(401).json({msg: 'Password is required.'});
    }

    // check if password is at least 6 characters
    if (req.body.password.length < 6) {
        return res.status(401).json({msg: 'Password must be at least 6 characters.'});
    }

    //check if password and confirm password match
    if (req.body.password != req.body.passwordConfirmation) {
        return res.status(401).json({msg: 'Passwords do not match.'});
    }

    User.findOne({
        where: {id, salt}
    })
    .then(user => {

        if (!user) return res.status(401).json({msg: 'Something went wrong, please try again.'});

        var hashed = crypto.pbkdf2Sync(req.body.password, user.salt, 310000, 32, 'sha256').toString('hex');
        user.password = hashed;
        user.save();

        res.render('auth/reset-password-saved');
        
    })
    .catch(err => {
        res.render('error/404', { message: 'The link is wrong, please try again.' });
    });

}
);

// account verification endpoint
router.get('/account-verification/:verificationCode', async (req, res, next) => {

    User.findOne({
        where: { verificationCode: req.params.verificationCode }
    })
    .then(user => {

        if (!user) return res.render('auth/account-verified', { msg: 'Account verification failed.' });

        // check if user is already verified
        if (user.isVerified) return res.render('auth/account-verified', { msg: 'This account is already verified.' });

        user.isVerified = true;
        user.save();

        return res.render('auth/account-verified', { msg: 'Account has been verified' });

    })
    .catch(err => res.status(500).json({message: err.message}));

}
);

// passport.use(new GoogleStrategy({
//     clientID: process.env['GOOGLE_CLIENT_ID'],
//     clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
//     callbackURL: process.env['APP_URL'] + '/api/auth/google/callback',
//     scope: [ 'profile', 'email' ]
//
// }, function(issuer, profile, cb) {
//
//     console.log(issuer, profile);
//
//     UserSocialLogins.findOne({
//             where: { provider: 'google', providerUserId: profile.id }
//         }
//     )
//         .then(user => {
//
//                 if (!user) {
//
//                     let userEmailExists = User.findOne({
//                         where: { email: profile.emails[0].value }
//                     }).then(user => {
//                         console.log('user exists:');
//                         console.log(user);
//                         if(user) {
//
//                             return cb(null, false, { message: 'There is already an account using this email address.' });
//
//                         } else {
//
//                             // The Google account has not logged in to this app before.  Create a
//                             // new user record and link it to the Google account.
//                             User.create({
//                                 firstName: profile.name.givenName,
//                                 lastName: profile.name.familyName,
//                                 email: profile.emails[0].value,
//                                 password: '',
//                                 salt: '',
//                                 isVerified: true,
//                                 verificationCode: '',
//                                 role: 'student',
//                                 provider: 'google',
//                             }).then(user => {
//
//                                 UserSocialLogins.create({
//                                     provider: 'google',
//                                     providerUserId: profile.id,
//                                     userId: user.id
//                                 }).then(userSocialLogin => {
//                                     return cb(null, user);
//                                 }).catch(err => {
//                                     return cb(err);
//                                 });
//
//                             }).catch(err => {
//                                 return cb(err);
//                             });
//
//                         }
//
//                     });
//
//                 } else {
//
//                     // The Google account has logged in to this app before.  Return the existing
//                     // user record.
//                     return cb(null, user);
//
//                 }
//
//             }
//         )
//         .catch(err => {
//             return cb(err);
//         });
//
// }));


// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


// router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/api/auth/google/failed' }),
//     (req, res) => {
//         // This callback will be called after a successful authentication
//         // You can redirect the user to a different page or respond with a JSON web token here
//         res.redirect('/api/auth/google/success');
//     }
// );

// passport.serializeUser( (user, done) => {
//     done(null, user)
// })
//
// passport.deserializeUser((user, done) => {
//     done (null, user)
// })

// router.get('/google/callback', (req, res, next) => {
//     passport.authenticate('google', (err, user, info) => {
//
//         console.log('CALLBACK');
//
//         if (err) {
//             // Handle the error
//             console.error('Authentication Error:', err);
//             return res.json(err);
//         }
//
//         if(info) {
//             console.error('Authentication Info:', info);
//
//             if(info.message) {
//                 return res.json(info);
//             }
//
//             // TODO: Generate JWT
//             User.findByPk(user.id)
//             .then(user => {
//                 let token = user.generateJWT()
//                 return res.json({ message: 'success', token });
//             }).catch(err => {
//                 return res.json(err);
//             })
//
//         }
//
//
//     })(req, res, next);
// });


router.post('/google', (req, res) => {

    let { providerUserId, firstName, lastName, email } = req.body;

    console.log(req.body);

    UserSocialLogins.findOne({ where: { provider: 'google', providerUserId }})
    .then(userSocial => {

        console.log('test1');

            if (!userSocial) {

                let userEmailExists = User.findOne({
                    where: { email }
                }).then(user => {

                    if(user) {

                        return res.status(400).json({
                            status: 'failed',
                            message: 'There is already an account using this email address.'
                        });

                    } else {

                        // The Google account has not logged in to this app before.  Create a
                        // new user record and link it to the Google account.
                        User.create({
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            password: '',
                            salt: '',
                            isVerified: true,
                            verificationCode: '',
                            role: 'student',
                            provider: 'google',
                        }).then(user => {

                            UserSocialLogins.create({
                                provider: 'google',
                                providerUserId: providerUserId,
                                userId: user.id
                            }).then(userSocialLogin => {
                                return res.status(200).json({
                                    status: 'success',
                                    message: 'Login has been successful.',
                                    token: user.generateJWT(),
                                    user: user
                                });
                            }).catch(err => {
                                return res.status(400).json({
                                    status: 'failed',
                                    message: 'Request failed (#1000).'
                                });
                            });

                        }).catch(err => {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Request failed (#1001).'
                            });
                        });

                    }

                });

            } else {

                let user = User.findByPk(userSocial.userId)
                    .then(user => {
                        return res.status(200).json({
                            status: 'success',
                            message: 'Login has been successful.',
                            token: user.generateJWT(),
                            user: user
                        });
                }).catch(err => {
                    return res.status(400).json({
                        status: 'failed',
                        message: 'Request failed (#1003).'
                    });
                })

            }

        }
    )
    .catch(err => {
        return res.status(400).json({
            status: 'failed',
            message: 'Request failed (#1002).',
            error: err
        });
    });

});

router.post('/facebook', (req, res) => {

    let { providerUserId, firstName, lastName, email } = req.body;

    UserSocialLogins.findOne({ where: { provider: 'facebook', providerUserId }})
        .then(userSocial => {

                if (!userSocial) {

                    let userEmailExists = User.findOne({
                        where: { email }
                    }).then(user => {

                        if(user) {

                            return res.status(400).json({
                                status: 'failed',
                                message: 'There is already an account using this email address.'
                            });

                        } else {

                            // The Google account has not logged in to this app before.  Create a
                            // new user record and link it to the Google account.
                            User.create({
                                firstName: firstName,
                                lastName: lastName,
                                email: email,
                                password: '',
                                salt: '',
                                isVerified: true,
                                verificationCode: '',
                                role: 'student',
                                provider: 'facebook',
                            }).then(user => {

                                UserSocialLogins.create({
                                    provider: 'facebook',
                                    providerUserId: providerUserId,
                                    userId: user.id
                                }).then(userSocialLogin => {
                                    return res.status(200).json({
                                        status: 'success',
                                        message: 'Login has been successful.',
                                        token: user.generateJWT(),
                                        user: user
                                    });
                                }).catch(err => {
                                    return res.status(400).json({
                                        status: 'failed',
                                        message: 'Request failed (#1000).'
                                    });
                                });

                            }).catch(err => {
                                return res.status(400).json({
                                    status: 'failed',
                                    message: 'Request failed (#1001).'
                                });
                            });

                        }

                    });

                } else {

                    let user = User.findByPk(userSocial.userId)
                        .then(user => {
                            return res.status(200).json({
                                status: 'success',
                                message: 'Login has been successful.',
                                token: user.generateJWT(),
                                user: user
                            });
                        }).catch(err => {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Request failed (#1003).'
                            });
                        })

                }

            }
        )
        .catch(err => {
            return res.status(400).json({
                status: 'failed',
                message: 'Request failed (#1002).',
                error: err
            });
        });

});

router.post('/apple', (req, res) => {

    let { providerUserId, firstName, lastName, email } = req.body;

    UserSocialLogins.findOne({ where: { provider: 'apple', providerUserId }})
        .then(userSocial => {

                if (!userSocial) {

                    let userEmailExists = User.findOne({
                        where: { email }
                    }).then(user => {

                        if(user) {

                            return res.status(400).json({
                                status: 'failed',
                                message: 'There is already an account using this email address.'
                            });

                        } else {

                            // The Google account has not logged in to this app before.  Create a
                            // new user record and link it to the Google account.
                            User.create({
                                firstName: firstName,
                                lastName: lastName,
                                email: email,
                                password: '',
                                salt: '',
                                isVerified: true,
                                verificationCode: '',
                                role: 'student',
                                provider: 'apple',
                            }).then(user => {

                                UserSocialLogins.create({
                                    provider: 'apple',
                                    providerUserId: providerUserId,
                                    userId: user.id
                                }).then(userSocialLogin => {
                                    return res.status(200).json({
                                        status: 'success',
                                        message: 'Login has been successful.',
                                        token: user.generateJWT(),
                                        user: user
                                    });
                                }).catch(err => {
                                    return res.status(400).json({
                                        status: 'failed',
                                        message: 'Request failed (#1000).'
                                    });
                                });

                            }).catch(err => {
                                return res.status(400).json({
                                    status: 'failed',
                                    message: 'Request failed (#1001).'
                                });
                            });

                        }

                    });

                } else {

                    let user = User.findByPk(userSocial.userId)
                        .then(user => {
                            return res.status(200).json({
                                status: 'success',
                                message: 'Login has been successful.',
                                token: user.generateJWT(),
                                user: user
                            });
                        }).catch(err => {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Request failed (#1003).'
                            });
                        })

                }

            }
        )
        .catch(err => {
            return res.status(400).json({
                status: 'failed',
                message: 'Request failed (#1002).',
                error: err
            });
        });

});

router.post('/microsoft', (req, res) => {

    let { providerUserId, firstName, lastName, email } = req.body;

    UserSocialLogins.findOne({ where: { provider: 'microsoft', providerUserId }})
        .then(userSocial => {

                if (!userSocial) {

                    let userEmailExists = User.findOne({
                        where: { email }
                    }).then(user => {

                        if(user) {

                            return res.status(400).json({
                                status: 'failed',
                                message: 'There is already an account using this email address.'
                            });

                        } else {

                            // The Google account has not logged in to this app before.  Create a
                            // new user record and link it to the Google account.
                            User.create({
                                firstName: firstName,
                                lastName: lastName,
                                email: email,
                                password: '',
                                salt: '',
                                isVerified: true,
                                verificationCode: '',
                                role: 'student',
                                provider: 'microsoft',
                            }).then(user => {

                                UserSocialLogins.create({
                                    provider: 'microsoft',
                                    providerUserId: providerUserId,
                                    userId: user.id
                                }).then(userSocialLogin => {
                                    return res.status(200).json({
                                        status: 'success',
                                        message: 'Login has been successful.',
                                        token: user.generateJWT(),
                                        user: user
                                    });
                                }).catch(err => {
                                    return res.status(400).json({
                                        status: 'failed',
                                        message: 'Request failed (#1000).'
                                    });
                                });

                            }).catch(err => {
                                return res.status(400).json({
                                    status: 'failed',
                                    message: 'Request failed (#1001).'
                                });
                            });

                        }

                    });

                } else {

                    let user = User.findByPk(userSocial.userId)
                        .then(user => {
                            return res.status(200).json({
                                status: 'success',
                                message: 'Login has been successful.',
                                token: user.generateJWT(),
                                user: user
                            });
                        }).catch(err => {
                            return res.status(400).json({
                                status: 'failed',
                                message: 'Request failed (#1003).'
                            });
                        })

                }

            }
        )
        .catch(err => {
            return res.status(400).json({
                status: 'failed',
                message: 'Request failed (#1002).',
                error: err
            });
        });

});

module.exports = router

