const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student");
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/studentDB")
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });


app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json(error);
  }

});

app.post("/students", async (req, res) => {
  try {
    const student = new Student({
      name: req.body.name,
      course: req.body.course
    });

    await student.save();

    res.json({
      message: "Student Added Successfully"
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.delete("/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);

    res.json({
      message: "Student Deleted Successfully"
    });
  } catch (error) {
    res.status(500).json(error);
  }
});
app.put("/students/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        course: req.body.course
      },
      { new: true }
    );

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json(error);
  }
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});