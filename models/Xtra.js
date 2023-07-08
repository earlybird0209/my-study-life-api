const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    const Xtra = sequelize.define('Xtra', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        eventType: {
            type: DataTypes.STRING,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
        },
        occurs: {
            type: DataTypes.STRING,
            // values: ['once', 'repeating', 'rotational'],
            allowNull: true
        },
        days: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true
        },
        startTime: {
            type: DataTypes.TIME,
            allowNull: true
        },
        endTime: {
            type: DataTypes.TIME,
            allowNull: true
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        image: {
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
        imageUrl: {
            type: DataTypes.VIRTUAL,
            get() {
                if (this.image) {
                    return 'https://' + process.env.DIGITAL_OCEAN_SPACES_ENDPOINT + '/' + process.env.DIGITAL_OCEAN_BUCKET + '/xtras/' + this.userId + '/' + this.image;
                } else {
                    return null;
                }
            },
        }
    }, {
        timestamps: true,
        defaultScope: {
            attributes: {
                exclude: [],
                include: ['imageUrl']
            },
        }
    });

    return Xtra;

};
