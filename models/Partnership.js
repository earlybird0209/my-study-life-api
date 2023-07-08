const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    const Partnership = sequelize.define('Partnership', {
        title: {
            type: DataTypes.STRING,
            allowNull: true
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        link: {
            type: DataTypes.STRING,
            allowNull: true
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
                    return 'https://' + process.env.DIGITAL_OCEAN_SPACES_ENDPOINT + '/' + process.env.DIGITAL_OCEAN_BUCKET + '/partnership-images/' + this.image;
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

    return Partnership;
    
};
