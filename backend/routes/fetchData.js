// backend/routes/fetchData.js
const express = require("express");
const router = express.Router();
const { safeFetch, isSafeUrl } = require("../utils/safeFetch");

// Optional host whitelist (comma-separated in env): e.g. "jsonplaceholder.typicode.com,api.example.com"
const ALLOWED_HOSTS = (process.env.ALLOWED_HOSTS || "jsonplaceholder.typicode.com").split(",").map(h => h.trim()).filter(Boolean);

router.get("/fetch", async (req, res) => {
  try {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send("URL is required");

    let parsed;
    try {
      parsed = new URL(targetUrl);
    } catch (e) {
      return res.status(400).send("Invalid URL");
    }

    // If you use a whitelist, enforce it
    if (ALLOWED_HOSTS.length && !ALLOWED_HOSTS.includes(parsed.hostname)) {
      return res.status(403).send("Host not allowed");
    }

    // Additionally validate the URL resolves to a public IP
    if (!await isSafeUrl(targetUrl)) {
      return res.status(403).send("URL not allowed");
    }

    const data = await safeFetch(targetUrl);
    return res.json({ data });
  } catch (err) {
    console.error("fetch error:", err && err.message);
    if (err.code === "SSRF_BLOCKED") {
      return res.status(403).send("URL not allowed");
    }
    return res.status(502).send("Error fetching URL");
  }
});

module.exports = router;
