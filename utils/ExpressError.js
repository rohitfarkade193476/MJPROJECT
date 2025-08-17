

class ExpressError extends Error {
    constructor(statusCode, message) {
        super(message); // ✅ Fix: use the actual message
        this.statusCode = statusCode;
    }
}

// module.exports = ExpressError;