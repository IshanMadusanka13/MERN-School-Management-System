const express = require("express");
const router = express.Router();
const axios = require("axios");

// Whitelist of allowed hosts
const allowedHosts = ["jsonplaceholder.typicode.com", "api.example.com"]; // change as needed

router.get("/fetch", async (req, res) => {
  try {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send("URL is required");

    const parsedUrl = new URL(targetUrl);

    // Check if hostname is allowed
    if (!allowedHosts.includes(parsedUrl.hostname)) {
      return res.status(403).send("Host not allowed");
    }

    const response = await axios.get(targetUrl);
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching URL");
  }
});

module.exports = router;
