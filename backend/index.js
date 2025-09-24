const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet"); // Added Helmet for secure HTTP headers
const rateLimit = require("express-rate-limit"); //  Added rate limiting
const xss = require("xss-clean"); // Prevent XSS attacks
const mongoSanitize = require("express-mongo-sanitize"); //  Prevent NoSQL Injection

const app = express();
const Routes = require("./routes/route.js");

const PORT = process.env.PORT || 5000;

dotenv.config();

// Use JSON parser with size limit to prevent DoS (Denial of Service)
app.use(express.json({ limit: "10kb" })); 
// Original code allowed 10mb, which is too large and can cause DoS attacks
// app.use(express.json({ limit: "10mb" }));

// Secure CORS - instead of allowing everyone (*), allow only trusted domains
const corsOptions = {
  origin: ["http://localhost:3000"], // replace with your frontend URL(s)
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));
// Original code: app.use(cors()) → allows * (any domain), insecure

// Add security middlewares
app.use(helmet()); // sets various HTTP headers to secure Express apps
app.use(xss()); // sanitize user input to prevent XSS
app.use(mongoSanitize()); // prevent MongoDB operator injection (like $gt, $ne)

// Rate limiting to prevent brute force attacks (e.g., login abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Connect to MongoDB securely
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log("❌ Database connection error", err));

app.use("/", Routes);

app.listen(PORT, () => {
  console.log(` Server started at port ${PORT}`);
});
