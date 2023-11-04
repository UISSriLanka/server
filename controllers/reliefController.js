const schedule = require("node-schedule");
const TimeTable = require("../models/timeTableModel");
const StaffAttendance = require("../models/staffAttendanceModel");
const Staff = require("../models/staffModel");
const Relief = require("../models/reliefModel");
const asyncHandler = require("express-async-handler");

// Everyday at 2.30pm, set the 'temp' field of the time table model back to false
const updateSchedule = schedule.scheduleJob("30 14 * * *", async function () {
  await TimeTable.updateMany({}, { $set: { temp: false } });
  await Relief.deleteMany({});
});

const resetRelief = asyncHandler(async (req, res) => {
  try {
    await TimeTable.updateMany({}, { $set: { temp: false } });
    await Relief.deleteMany({});

    res.send({ message: "Reset Successful" });
  } catch (error) {
    console.error("Reset Unsuccessful");
  }
});

const getAbsentStaff = asyncHandler(async (req, res) => {
  try {
    // Check the staff attendance model; if absent for a particular day, set 'temp' to true
    const currentDate = new Date().toISOString().substr(0, 10);
    const staffMembers = await TimeTable.find({}, "staff");
    const TodayDate = new Date();
    const currentDay = TodayDate.getDay();

    for (const staffMember of staffMembers) {
      const staffAttendance = await StaffAttendance.find({
        staff: staffMember.staff,
        date: currentDate,
      });
      if (!staffAttendance.length > 0) {
        await TimeTable.updateMany(
          { staff: staffMember.staff, weekday: currentDay },
          { $set: { temp: true } }
        );
      } else {
        await TimeTable.updateMany(
          { staff: staffMember.staff },
          { $set: { temp: false } }
        );
      }
    }

    // Copy records with 'temp' set to true to the relief model
    const tempData = await TimeTable.find({ temp: true });
    const transformedData = [];

    for (const item of tempData) {
      const existingReliefRecord = await Relief.findOne({
        weekday: item.weekday,
        period: item.period,
        grade: item.grade,
      });

      if (!existingReliefRecord) {
        transformedData.push({
          weekday: item.weekday,
          period: item.period,
          grade: item.grade,
          subject: item.subject,
          staff: item.staff,
        });
      }
    }

    const copiedData = await Relief.insertMany(transformedData);

    // Check the present staff for subjects in the relief table
    const presentStaff = await StaffAttendance.find({
      date: currentDate,
    });

    const presentStaffID = presentStaff.map((staffID) => staffID.staff);

    const timetableEntries = await TimeTable.find({
      staff: presentStaffID,
    }).select(["-_id", "weekday", "period", "staff", "grade", "subject"]);

    const absentPeriod = await Relief.find({}).select([
      "_id",
      "weekday",
      "period",
      "subject",
      "grade",
    ]);

    // Allocate relief according to three conditions
    const updatePromises = [];

    for (const abs of absentPeriod) {
      const samePeriod = timetableEntries.filter((prst) => {
        return prst.period === abs.period && prst.weekday === abs.weekday;
      });

      const staffToExclude = samePeriod.map((entry) => entry.staff);

      const matchingEntries = timetableEntries.filter((tym) => {
        return !staffToExclude.some(
          (staffId) => staffId.toString() === tym.staff.toString()
        );
      });

      // 1. Select a random staff member from the same subject

      const matchingSubjectEntries = matchingEntries.filter(
        (entry) => entry.subject === abs.subject
      );

      if (matchingSubjectEntries.length > 0) {
        const matchingStaff = matchingSubjectEntries.map(
          (entry) => entry.staff
        );

        updatePromises.push({
          _id: abs._id,
          staff: matchingStaff,
        });
      } else {
        const matchingGradeStaff = matchingEntries
          .filter((entry) => entry.grade === abs.grade)
          .map((entry) => entry.staff);

        if (matchingGradeStaff.length > 0) {
          // 2. Select a random staff member from the same grade
          const randomIndex = Math.floor(
            Math.random() * matchingGradeStaff.length
          );
          const randomStaff = matchingGradeStaff[randomIndex];

          updatePromises.push({
            _id: abs._id,
            staff: [randomStaff],
          });
        } else {
          if (matchingEntries.length > 0) {
            // 3. Select a random staff member from the present staff

            const randomIndex = Math.floor(
              Math.random() * matchingEntries.length
            );
            const randomStaff = matchingEntries[randomIndex].staff;

            updatePromises.push({
              _id: abs._id,
              staff: [randomStaff],
            });
          } else {
            updatePromises.push({
              _id: abs._id,
              staff: abs.staff,
            });
          }
        }
      }
    }

    //Check whether same staff assigned for same weekday and period
    const fetchedAbsent = [];

    for (const up of updatePromises) {
      const absent = await Relief.findOne({ _id: up._id }).select(
        "-_id weekday period"
      );
      fetchedAbsent.push({
        _id: up._id,
        weekday: absent.weekday,
        period: absent.period,
        staff: up.staff,
      });
    }

    function findUniqueEntries(entries) {
      const seen = new Set();
      const uniqueEntries = [];

      for (const entry of entries) {
        const key = `${entry.weekday}-${entry.period}-${entry.staff}`;
        if (!seen.has(key)) {
          uniqueEntries.push({ _id: entry._id, staff: entry.staff });
          seen.add(key);
        }
        //  else {
        //   uniqueEntries.push({ _id: entry._id, staff: entry.staff });
        // }
      }

      return uniqueEntries;
    }

    const uniqueEntries = findUniqueEntries(fetchedAbsent);

    // Final updates after allocating relief
    const updateResults = await Promise.all(
      uniqueEntries.map(async (update) => {
        return Relief.updateMany(
          { _id: update._id },
          { $set: { staff: update.staff } }
        );
      })
    );

    // console.log("unique", uniqueEntries);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Error updating Relief objects" });
  }
});

module.exports = {
  getAbsentStaff,
  resetRelief,
};
