const Relief = require("../models/reliefModel");
const TimeTable = require("../models/timeTableModel");
const asyncHandler = require("express-async-handler");

const getTimeTable = asyncHandler(async (req, res) => {
  const timeTable = await TimeTable.find();
  res.json(timeTable);
});

const getByGrade = asyncHandler(async (req, res) => {
  const grade = req.params.grade;

  if (isNaN(grade)) {
    return res.status(400).json({ error: "Grade should be a valid number" });
  }

  try {
    const tableData = await TimeTable.find({
      grade: grade,
      temp: false,
    });

    const reliefData = await Relief.find({
      grade: grade,
    });

    if (!tableData || tableData.length === 0) {
      return res.status(404).json({ Error: "No records in TimeTable" });
    }

    const response = tableData.map((timeTable) => ({
      _id: timeTable._id,
      weekday: timeTable.weekday,
      period: timeTable.period,
      subject: timeTable.subject,
      staff: timeTable.staff,
      temp: timeTable.temp,
    }));

    const reliefFormatted = reliefData.map((relief) => ({
      _id: relief._id,
      weekday: relief.weekday,
      period: relief.period,
      subject: relief.subject,
      staff: relief.staff,
      temp: relief.temp,
    }));

    const finalTimeTable = [...response, ...reliefFormatted];

    res.json(finalTimeTable);
  } catch (err) {
    console.error("Error fetching data:", err);
    return res.status(500).json({ error: "Error fetching data" });
  }
});

const createTimeTable = asyncHandler(async (req, res) => {
  const weekday = req.params.weekday;
  const period = req.params.period;
  const grade = req.params.grade;

  if (!weekday || !period || !grade) {
    return res
      .status(400)
      .json({ error: "Please provide all three parameters" });
  }

  const subject = req.body.subject;
  const staffId = req.body.staff;

  try {
    const existingTimeTable = await TimeTable.findOne({
      weekday: weekday,
      period: period,
      staff: staffId,
    });

    if (existingTimeTable) {
      return res
        .status(400)
        .json({ error: "Particular staff has another period" });
    }

    const newTimeTable = new TimeTable({
      weekday: weekday,
      period: period,
      grade: grade,
      subject: subject,
      staff: staffId,
    });

    try {
      await newTimeTable.save();

      res.json({ timeTable: newTimeTable });
    } catch (err) {
      console.error("Error saving time table:", err);
      return res.status(500).json({ error: "Error saving data." });
    }
  } catch (err) {
    return res.status(500).json({ error: "Error fetching data." });
  }
});

const getTimeTableById = asyncHandler(async (req, res) => {
  const timeTable = await TimeTable.findById(req.params.id);

  if (timeTable) {
    res.json(timeTable);
  } else {
    res.status(404).json({ message: "Time table Not Found" });
  }
});

const deleteTimeTable = asyncHandler(async (req, res) => {
  const timeTable = await TimeTable.findById(req.params.id);

  if (timeTable) {
    await timeTable.deleteOne();
    res.json({ message: "Period Removed Successfully" });
  } else {
    res.status(404);
    throw new Error("Period not found");
  }
});

const getTimeTableByStaffID = asyncHandler(async (req, res) => {
  try {
    const staff = req.params.staff;
    const timetableEntries = await TimeTable.find({ staff: staff });
    const reliefEntries = await Relief.find({ staff: staff });

    const StaffTimeTable = [...timetableEntries, ...reliefEntries];

    if (StaffTimeTable) {
      res.json(StaffTimeTable);
    } else {
      res.json({ message: "No entries for particular staff" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching staff's timetable entries", error });
  }
});

module.exports = {
  getTimeTable,
  getByGrade,
  createTimeTable,
  getTimeTableById,
  deleteTimeTable,
  getTimeTableByStaffID,
};
