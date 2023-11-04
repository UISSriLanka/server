const Mark = require("../models/MarkModel");

const asyncHandler = require("express-async-handler");

const getMarks = asyncHandler(async (req, res) => {
  const marks = await Mark.find();
  res.json(marks);
});

const getStudentMarksByID = async (req, res) => {
  try {
    const { year, term, id } = req.params;

    const mark = await Mark.aggregate([
      {
        $match: {
          year: parseInt(year),
          term: parseInt(term),
          students: { $elemMatch: { student: id } },
        },
      },
      {
        $unwind: "$students",
      },
      {
        $match: {
          "students.student": id,
        },
      },
      {
        $addFields: {
          subject: "$subject",
          score: "$students.score",
        },
      },
      {
        $project: {
          _id: 0,
          score: 1,
          subject: 1,
        },
      },
    ]);

    res.json(mark);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student marks", error });
  }
};

const getStudentMarksByGrade = async (req, res) => {
  const year = req.params.year;
  const term = req.params.term;
  const grade = req.params.grade;

  if (!year || !term || !grade) {
    return res
      .status(400)
      .json({ error: "Please provide all three parameters in the URL." });
  }

  try {
    const marksData = await Mark.find({
      year: year,
      term: term,
      grade: grade,
    });

    if (!marksData || marksData.length === 0) {
      return res
        .status(404)
        .json({ error: "No records found for the provided parameters." });
    }

    const response = marksData.map((mark) => ({
      subject: mark.subject,
      students: mark.students,
    }));

    res.json(response);
  } catch (err) {
    console.error("Error fetching marks:", err);
    return res.status(500).json({ error: "Error fetching data." });
  }
};

const getStudentMarksByTerm = async (req, res) => {
  const year = req.params.year;
  const grade = req.params.grade;
  const subject = req.params.subject;

  if (!year || !grade || !subject) {
    return res
      .status(400)
      .json({ error: "Please provide all three parameters in the URL." });
  }

  try {
    const marksData = await Mark.find({
      year: year,
      grade: grade,
      subject: subject,
    });

    if (!marksData || marksData.length === 0) {
      return res
        .status(404)
        .json({ error: "No records found for the provided parameters." });
    }

    const response = marksData.map((mark) => ({
      term: mark.term,
      scores: mark.students.map(student => student.score),
    }));

    res.json(response);
  } catch (err) {
    console.error("Error fetching marks:", err);
    return res.status(500).json({ error: "Error fetching data." });
  }
};


const getStudentMarksByParams = asyncHandler(async (req, res) => {
  const year = req.params.year;
  const term = req.params.term;
  const subject = req.params.subject;
  const grade = req.params.grade;

  if (!year || !term || !subject || !grade) {
    return res
      .status(400)
      .json({ error: "Please provide all four parameters in the URL." });
  }

  try {
    const mark = await Mark.findOne({
      year: year,
      term: term,
      subject: subject,
      grade: grade,
    });

    if (!mark) {
      return res
        .status(404)
        .json({ error: "No record found for the provided parameters." });
    }

    const response = {
      students: mark.students,
    };

    res.json(response);
  } catch (err) {
    return res.status(500).json({ error: "Error fetching data." });
  }
});

const saveMarks = asyncHandler(async (req, res) => {
  const year = req.params.year;
  const term = req.params.term;
  const subject = req.params.subject;
  const grade = req.params.grade;

  if (!year || !term || !subject || !grade) {
    return res
      .status(400)
      .json({ error: "Please provide all four parameters in the URL." });
  }

  try {
    let mark = await Mark.findOne({
      year: year,
      term: term,
      subject: subject,
      grade: grade,
    });

    if (!mark) {
      mark = new Mark({
        year: year,
        term: term,
        subject: subject,
        grade: grade,
      });
    }

    const studentUpdates = req.body.students || [];

    studentUpdates.forEach((update) => {
      const { studentId, score } = update;
      let parsedScore;

      if (!isNaN(score)) {
        parsedScore = parseFloat(score);
      } else if (score === "AB") {
        parsedScore = "AB";
      } else {
        parsedScore = 0;
      }

      const studentIndex = mark.students.findIndex(
        (student) => student.student === studentId
      );

      if (studentIndex !== -1) {
        mark.students[studentIndex].score = parsedScore;
      } else {
        mark.students.push({ student: studentId, score: parsedScore });
      }
    });

    mark.students = studentUpdates;

    try {
      await mark.save();

      res.json({ mark });
    } catch (err) {
      console.error("Error saving mark:", err);
      return res.status(500).json({ error: "Error saving data." });
    }
  } catch (err) {
    return res.status(500).json({ error: "Error fetching data." });
  }
});

const editMarks = asyncHandler(async (req, res) => {
  const year = req.params.year;
  const term = req.params.term;
  const subject = req.params.subject;
  const grade = req.params.grade;

  if (!year || !term || !subject || !grade) {
    return res
      .status(400)
      .json({ error: "Please provide all four parameters in the URL." });
  }

  try {
    const mark = await Mark.findOne({
      year: year,
      term: term,
      subject: subject,
      grade: grade,
    });

    if (!mark) {
      return res
        .status(404)
        .json({ error: "No record found for the provided parameters." });
    }

    const studentUpdates = req.body.students || [];

    studentUpdates.forEach((update) => {
      const { studentId, score } = update;
      const parsedScore = score === "AB" ? "AB" : parseFloat(score);
      const studentIndex = mark.students.findIndex(
        (student) => student.student === studentId
      );

      if (studentIndex !== -1) {
        mark.students[studentIndex].score = parsedScore;
      }
    });
    mark.students = studentUpdates;

    try {
      await mark.save();

      res.json({ mark });
    } catch (err) {
      console.error("Error saving mark:", err);
      return res.status(500).json({ error: "Error updating data." });
    }
  } catch (err) {
    return res.status(500).json({ error: "Error fetching data." });
  }
});

module.exports = {
  getMarks,
  saveMarks,
  getStudentMarksByID,
  getStudentMarksByGrade,
  getStudentMarksByTerm,
  getStudentMarksByParams,
  editMarks,
};
