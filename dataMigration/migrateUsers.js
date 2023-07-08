// add db from config/sourceDB.js
const sequelizeSource = require('../config/sourceDB');
const { User } = require('../config/db');
const { Sequelize } = require('sequelize');

const migrateUsers = async function migrateUsers() {
    
  const query = 'SELECT TOP 1000 * FROM Users;';
  const Users = await sequelizeSource.query(query, { type: Sequelize.QueryTypes.SELECT });

  // save Users to target db with model Users
  Users.map(async (user) => {

    // check if email is valid
    if (!validateEmail(user.Email)) {
      console.log('Invalid email:', user.Email);
      return;
    }

    // check if user already exists
    const userExists = await User.findOne({
      where: {
        email: user.Email
      }
    });

    if (userExists) {
      console.log('User already exists:', user.Email);
      return;
    }

    try {

      await User.create({
        id: user.Id,
        role: getRole(user.Role),
        firstName: user.FirstName,
        lastName: user.LastName,
        email: user.Email,
        password: user.Password,
        salt: user.Salt,
        createdAt: user.RegisteredAt,
        updatedAt: user.UpdatedAt,
        isVerified: user.Activated,
        verificationCode: user.VerificationCode,
        profileImage: user.Picture,
        refreshToken: null,
        refreshTokenExpiryDate: null
      });

      console.log('User created:', user.Email);

    } catch (error) {
      console.error('Error while getting Users:', error);
    } finally {
      
    }
    
  });

  await sequelizeSource.close();
}
    
  
function getRole(role) {
    switch (role) {
        case 0:
        return 'student';
        case 1:
        return 'teacher';
        case 2:
        return 'admin';
        default:
        return 'student';
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

module.exports = migrateUsers;