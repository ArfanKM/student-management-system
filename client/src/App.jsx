import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/students"
      );

      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async () => {
    if (!name || !course) {
      alert("Please fill all fields");
      return;
    }

    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:5000/students/${editId}`,
          {
            name,
            course,
          }
        );

        alert("Student Updated Successfully");

        setIsEditing(false);
        setEditId(null);
      } else {
        await axios.post(
          "http://localhost:5000/students",
          {
            name,
            course,
          }
        );

        alert("Student Added Successfully");
      }

      setName("");
      setCourse("");
      fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/students/${id}`
      );

      fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const editStudent = (student) => {
    setName(student.name);
    setCourse(student.course);
    setEditId(student._id);
    setIsEditing(true);
  };

  const filteredStudents = students.filter((student) =>
    student.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>🎓 Student Management System</h1>

      <div className="form-section">
        <input
          type="text"
          placeholder="Enter Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter Course"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        <button onClick={handleSubmit}>
          {isEditing
            ? "Update Student"
            : "Add Student"}
        </button>
      </div>

      <hr />

      <h3>Total Students: {students.length}</h3>

      <input
        type="text"
        placeholder="🔍 Search Student"
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <h2>Student List</h2>

      {filteredStudents.length === 0 ? (
        <p>No Students Found</p>
      ) : (
        filteredStudents.map((student) => (
          <div
            key={student._id}
            className="student-card"
          >
            <p>
              <strong>Name:</strong>{" "}
              {student.name}
            </p>

            <p>
              <strong>Course:</strong>{" "}
              {student.course}
            </p>

            <button
              className="edit-btn"
              onClick={() =>
                editStudent(student)
              }
            >
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() =>
                deleteStudent(student._id)
              }
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;