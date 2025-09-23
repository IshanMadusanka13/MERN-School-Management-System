const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../logs');
const logFile = path.join(logsDir, 'server.log');

// Ensure logs directory exists at startup (async, non-blocking)
fs.promises.mkdir(logsDir, { recursive: true }).catch((err) => {
    console.error('Failed to create logs directory:', err);
});

function sanitize(str) {
    return String(str).replace(/[\r\n|]/g, ' '); // Remove newlines and pipes
}

const logger = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const log = [
            `Time: ${new Date().toISOString()}`,
            `Method: ${sanitize(req.method)}`,
            `URL: ${sanitize(req.originalUrl)}`,
            `IP: ${sanitize(req.ip)}`,
            `Status: ${sanitize(res.statusCode)}`,
            `Duration: ${duration}ms`,
            `User-Agent: ${sanitize(req.headers['user-agent'])}`,
        ].join(' | ') + '\n';

        fs.appendFile(logFile, log, (err) => {
            if (err) {
                // Log error but do not expose details to client
                console.error('Failed to write log:', err.message);
            }
        });
    });

    next();
};

module.exports = logger;