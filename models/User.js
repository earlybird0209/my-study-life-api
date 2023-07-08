const { Sequelize, DataTypes, Op } = require('sequelize');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const moment = require('moment');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
      role: {
        type: DataTypes.ENUM,
        values: ['admin', 'student', 'teacher'],
        allowNull: false,
        defaultValue: 'student'
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate : {
          isEmail: {
            msg: "Wrong formatted email"
          },
          notEmpty: {
            msg: 'Email cannot be empty'
          },
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: true
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      verificationCode: {
        type: DataTypes.STRING,
        allowNull: true
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true
      },
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: true
      },
      refreshTokenExpiryDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      profileImageUrl: {
        type: DataTypes.VIRTUAL,
        get() {
            if (this.profileImage) {
                return 'https://' + process.env.DIGITAL_OCEAN_SPACES_ENDPOINT + '/' + process.env.DIGITAL_OCEAN_BUCKET + '/' + this.id + '/' + this.profileImage;
            } else {
                return null;
            }
        },
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active'
    },
    lastActiveAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true
    },

  }, {
    timestamps: true,
    scopes: {
      withoutPassword: {
        attributes: { exclude: ['password', 'salt', 'verificationCode', 'refreshToken', 'refreshTokenExpiryDate'] },
      }
    },
    defaultScope: {
      attributes: { 
          exclude: [],
          include: ['profileImageUrl']
      },
    }
  });


  User.prototype.comparePassword = function (password) {
    // compare password with salt
    var hashed = crypto.pbkdf2Sync(password, this.salt, 310000, 32, 'sha256').toString('hex');
    return this.password === hashed;
  };

  User.prototype.generateJWT = function () {
    // generate JWT
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 30); // 30 days

    // create refresh token
    this.refreshToken = crypto.randomBytes(32).toString('hex');
    var now = new Date();
    this.refreshTokenExpiryDate = moment(now).add(90, 'days').toDate();
    this.save();
    
    return jwt.sign({
      id: this.id,
      exp: parseInt(exp.getTime() / 1000),
      refreshToken: this.refreshToken
    }, '8c344712f850c098655c152d37d1e3f5');
  };

  return User;
  
};