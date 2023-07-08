const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    const Holiday = sequelize.define('Holiday', {

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        yearId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false
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
                    return 'https://' + process.env.DIGITAL_OCEAN_SPACES_ENDPOINT + '/' + process.env.DIGITAL_OCEAN_BUCKET + '/holidays/' + this.userId + '/' + this.image;
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

    return Holiday;
    
};
