const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Subject = sequelize.define('Subject', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        color: {
            type: DataTypes.STRING
        },
        image: {
            type: DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE
        },
        imageUrl: {
            type: DataTypes.VIRTUAL,
            get() {
                if (this.image) {
                    return 'https://' + process.env.DIGITAL_OCEAN_SPACES_ENDPOINT + '/' + process.env.DIGITAL_OCEAN_BUCKET + '/subjects/' + this.userId + '/' + this.image;
                } else {
                    return null;
                }
            },
        }
    }, 
    {
        defaultScope: {
            attributes: { 
                exclude: [],
                include: ['imageUrl']
            },
        }
    });

    return Subject;
    
};