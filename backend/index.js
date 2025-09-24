const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const helmet = require("helmet")
const passport = require('passport');
const session = require("express-session");
require('./oauth/passport'); // Ensure passport configuration is loaded
// const bodyParser = require("body-parser")
const app = express()
const Routes = require("./routes/route.js")
const logger = require('./middleware/logger.js');
const https = require('https');
const fs = require('fs');

const PORT = process.env.PORT || 5000

dotenv.config();

// app.use(bodyParser.json({ limit: '10mb', extended: true }))
// app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use(helmet())
app.use(express.json({ limit: '10mb' }))

app.disable('x-powered-by'); // Hide Express info

app.use(helmet({
    contentSecurityPolicy: false, // Adjust as needed for your frontend
    crossOriginResourcePolicy: { policy: "same-origin" }
}));

const allowedOrigins = ['https://localhost:3000'];
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Validate environment variables
if (!process.env.MONGO_URL) {
    throw new Error('MONGO_URL is not set in environment variables');
}

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(console.log("Connected to MongoDB"))
    .catch((err) => console.log("NOT CONNECTED TO NETWORK", err))

    app.use(
  session({
    secret: "1235586423", // change to strong secret, keep in .env
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set secure: true if using HTTPS
  })
);
app.use(passport.initialize());
app.use(passport.session());


app.use(logger);

app.use('/', Routes);

app.get('/', (req, res) => {
    res.send('MERN School Management System API is running securely!');
});

const privateKey = fs.readFileSync('./certs/key.pem', 'utf8');
const certificate = fs.readFileSync('./certs/cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
    console.log(`Secure server started at port no. ${PORT}`);
});