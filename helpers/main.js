const { Subject } = require('../config/db');

// Function to validate an email address
function validateEmail(email) {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}
  
function createSubjects(userId) {
    
    Subject.create({
        subject: 'Math',
        color: '#FF0000',
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    Subject.create({
        subject: 'Physics',
        color: '#FF0000',
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
    });


    Subject.create({
        subject: 'Biology',
        color: '#FF0000',
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    Subject.create({
        subject: 'Chemistry',
        color: '#FF0000',
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    Subject.create({
        subject: 'History',
        color: '#FF0000',
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    return true;

}
// Export the validateEmail function
module.exports = {
    validateEmail,
    createSubjects
};