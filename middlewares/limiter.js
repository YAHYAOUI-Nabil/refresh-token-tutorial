const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 60 * 1000, 
    max: 5, 
    message: 'Too many login attempts from this IP, please try again after a 60 second pause'
})

module.exports = limiter