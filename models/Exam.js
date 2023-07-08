const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Exam = sequelize.define('Exam', {
        // id: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        //     primaryKey: true,
        //     autoIncrement: true
        // },
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
        resit: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false
        },
        type: {
            type: DataTypes.ENUM,
            values: ['exam', 'quiz', 'test'],
            allowNull: true
        },
        module: {
            type: DataTypes.STRING
        },
        mode: {
            type: DataTypes.ENUM,
            values: ['online', 'in-person'],
            allowNull: true
        },
        onlineUrl: {
            type: DataTypes.STRING,
        },
        room: {
            type: DataTypes.STRING,
        },
        seat: {
            type: DataTypes.STRING,
        },
        startDate: {
            type: DataTypes.DATE,
        },
        startTime: {
            type: DataTypes.TIME,
            allowNull: true
        },
        duration: {
            type: DataTypes.INTEGER,
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

    return Exam;
    
};