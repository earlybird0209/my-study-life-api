const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Class = sequelize.define('Class', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        subjectId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'Subject',
                key: 'id'
            }
        },
        module: {
            type: DataTypes.STRING
        },
        mode: {
            type: DataTypes.ENUM,
            values: ['online', 'in-person'],
            allowNull: true
        },
        room: {
            type: DataTypes.STRING,
        },
        building: {
            type: DataTypes.STRING,
        },
        onlineUrl: {
            type: DataTypes.STRING,
        },
        teacher: {
            type: DataTypes.STRING,
        },
        teachersEmail: {
            type: DataTypes.STRING,
        },
        occurs: {
            type: DataTypes.ENUM,
            values: ['once', 'repeating', 'rotational'],
            allowNull: true
        },
        days: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true
        },
        startDate: {
            type: DataTypes.DATE,
        },
        endDate: {
            type: DataTypes.DATE,
        },
        startTime: {
            type: DataTypes.TIME,
            allowNull: true
        },
        endTime: {
            type: DataTypes.TIME,
            allowNull: true
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updatedAt: {
            type: DataTypes.DATE
        },
        


    }, {
    timestamps: true,
    scopes: {
        withoutPassword: {
        attributes: { exclude: [] },
        }
    }
    });


    return Class;
    
};