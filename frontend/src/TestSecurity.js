import { useState } from "react";

function TestSecurity() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");

  const handleFetch = async () => {
    try {
      const res = await fetch(`/api/fetch?url=${encodeURIComponent(url)}`);
      if (!res.ok) {
        const text = await res.text();
        setResult(`Error: ${text}`);
        return;
      }
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult(`Request failed: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔒 Security Fix Demo</h2>
      <p>Enter a URL below to test SSRF protection:</p>
      <input
        type="text"
        value={url}
        placeholder="Enter URL"
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "400px", padding: "5px" }}
      />
      <button onClick={handleFetch} style={{ marginLeft: "10px", padding: "5px 10px" }}>
        Fetch
      </button>

      <pre style={{ marginTop: "20px", background: "#f4f4f4", padding: "10px" }}>
        {result}
      </pre>
    </div>
  );
}

export default TestSecurity;
