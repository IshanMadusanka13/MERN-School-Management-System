import React, { useState } from "react";
import axios from "axios";

const FetchDataDemo = () => {
  const [url, setUrl] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleFetch = async (e) => {
    e.preventDefault();
    setResponse(null);
    setError(null);

    try {
      const res = await axios.get("https://localhost:5000/fetch", {
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

  const containerStyle = {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "2px 2px 12px #aaa",
    fontFamily: "Arial, sans-serif",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  };

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const preStyle = {
    backgroundColor: "#f4f4f4",
    padding: "10px",
    borderRadius: "5px",
    whiteSpace: "pre-wrap",
  };

  const errorStyle = {
    color: "red",
    marginTop: "10px",
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        🔒 SSRF Safe Fetch Demo
      </h2>

      <form onSubmit={handleFetch}>
        <input
          type="text"
          placeholder="Enter URL (e.g. https://jsonplaceholder.typicode.com/posts/1)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          Fetch Data
        </button>
      </form>

      {response && <pre style={preStyle}>{JSON.stringify(response, null, 2)}</pre>}
      {error && <p style={errorStyle}>{error}</p>}
    </div>
  );
};

export default FetchDataDemo;
