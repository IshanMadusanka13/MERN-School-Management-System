import React, { useState } from "react";
import axios from "axios";

const AddStudents = () => {
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");

  // SSRF fetch states
  const [url, setUrl] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // Add student form submit
  const handleAddStudent = (e) => {
    e.preventDefault();
    alert(`Student added: ${studentName} (${studentEmail})`);
    setStudentName("");
    setStudentEmail("");
  };

  // SSRF-safe fetch submit
  const handleFetch = async (e) => {
    e.preventDefault();
    setResponse(null);
    setError(null);

    try {
      const res = await axios.get("http://localhost:5000/fetch", {
        params: { url },
      });
      setResponse(res.data);
    } catch (err) {
      if (err.response) {
        setError(`Error: ${err.response.data || err.response.statusText}`);
      } else {
        setError("Error: Unable to fetch data");
      }
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", fontFamily: "Arial, sans-serif" }}>
      
      {/* Add Student Form */}
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Add Student</h2>
      <form onSubmit={handleAddStudent} style={{ marginBottom: "40px" }}>
        <input
          type="text"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="email"
          placeholder="Student Email"
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{ width: "100%", padding: "10px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "5px" }}
        >
          Add Student
        </button>
      </form>

      {/* SSRF Safe Fetch Section */}
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>🔒 SSRF Safe Fetch Demo</h2>
      <form onSubmit={handleFetch} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter URL (Allowed hosts only)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{ width: "100%", padding: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px" }}
        >
          Fetch Data
        </button>
      </form>

      {response && (
        <pre style={{ backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "5px", whiteSpace: "pre-wrap", marginTop: "10px" }}>
          {JSON.stringify(response, null, 2)}
        </pre>
      )}

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default AddStudents;
