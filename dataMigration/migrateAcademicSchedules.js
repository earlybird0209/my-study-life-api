// add db from config/sourceDB.js
const sequelizeSource = require('../config/sourceDB');
const { AcademicSchedule } = require('../config/db');
const { Sequelize } = require('sequelize');
const moment = require('moment');

const migrateAcademicSchedules = async function migrateAcademicSchedules() {
    
      const query = 'SELECT TOP 1000 * FROM AcademicSchedules ORDER BY "Id" ASC;';
      const sourceAcademicSchedules = await sequelizeSource.query(query, { type: Sequelize.QueryTypes.SELECT });

      // console.log(sourceAcademicSchedules);
      // return true;

      // save AcademicSchedules to target db with model AcademicSchedules
      sourceAcademicSchedules.map(async (sourceAcademicSchedule) => {
		
        // check if as already exists
        const asExists = await AcademicSchedule.findOne({
          where: {
            id: sourceAcademicSchedule.Id
          }
        });

        if (asExists) {
          console.log('as already exists, ID: ', sourceAcademicSchedule.Id);
          return;
        }

          try {

            await AcademicSchedule.create({
              id: sourceAcademicSchedule.Id,
              userId: sourceAcademicSchedule.UserId,
              guid: sourceAcademicSchedule.Guid,
              revision: sourceAcademicSchedule.Revision,
              parentGuid: sourceAcademicSchedule.ParentGuid,
              name: sourceAcademicSchedule.Name,
              startDate: sourceAcademicSchedule.StartDate ? sourceAcademicSchedule.StartDate : sourceAcademicSchedule.Date,
              endDate: sourceAcademicSchedule.EndDate ? sourceAcademicSchedule.EndDate : sourceAcademicSchedule.Date,
              timestamp: moment.unix(sourceAcademicSchedule.Timestamp).format('YYYY-MM-DD HH:mm:ss'),
              parentId: sourceAcademicSchedule.ParentId,
              schoolId: sourceAcademicSchedule.SchoolId,
              type: sourceAcademicSchedule.Type,
              schedulingMode: sourceAcademicSchedule.Scheduling_Mode,
              schedulingWeekcount: sourceAcademicSchedule.Scheduling_WeekCount,
              schedulingStartweek: sourceAcademicSchedule.Scheduling_StartWeek,
              schedulingDaycount: sourceAcademicSchedule.Scheduling_DayCount,
              schedulingStartday: sourceAcademicSchedule.Scheduling_StartDay,
              schedulingDays: sourceAcademicSchedule.Scheduling_Days,
              schedulingScope: sourceAcademicSchedule.Scheduling_Scope,
              schedulingAdjustmentjson: sourceAcademicSchedule.Scheduling_AdjustmentJson,
              extId: sourceAcademicSchedule.ExtId,
              createdAt: sourceAcademicSchedule.CreatedAt,
              updatedAt: sourceAcademicSchedule.UpdatedAt
            });

            console.log('AcademicSchedule created:', sourceAcademicSchedule.Id);

          } catch (error) {
            console.error('Error while getting ases:', error);
          } finally {

          }

        });

      await sequelizeSource.close();
 
}

module.exports = migrateAcademicSchedules;