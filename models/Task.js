const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {

    const Task = sequelize.define('Task', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        subjectId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        examId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        classId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        title: {
            type: DataTypes.STRING,

        },
        details: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        type: {
            type: DataTypes.STRING
        },
        progress: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        category: {
            type: DataTypes.ENUM,
            values: ['reminder', 'revision', 'essay', 'assignment', 'project', 'meeting', 'reading', 'other'],
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
        dueDate: {
            type: DataTypes.DATE,
        },
        completedAt: {
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

    return Task;
    
};
