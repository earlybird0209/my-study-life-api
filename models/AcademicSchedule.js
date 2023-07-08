const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const AcademicSchedule = sequelize.define('AcademicSchedule', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        guid: {
            type: DataTypes.STRING,
            allowNull: true
        },
        revision: {
            type: DataTypes.STRING,
            allowNull: true
        },
        parentGuid: {
            type: DataTypes.STRING,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        startDate: {
            type: DataTypes.DATE,
        },
        endDate: {
            type: DataTypes.DATE,
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: true
        },
        parentId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        schoolId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        type: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        schedulingMode: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        schedulingWeekcount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        schedulingStartweek: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        schedulingDaycount: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        schedulingStartday: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        schedulingDays: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        schedulingScope: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        schedulingAdjustmentsjson: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        extId: {
            type: DataTypes.STRING,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updatedAt: {
            type: DataTypes.DATE
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true
        },
    }, {
        timestamps: true,
        scopes: {}
    });


    return AcademicSchedule;

};