const asyncHandler = require("express-async-handler");

const notFound = asyncHandler((req, res, next) => {
    res.status(404)
    throw new Error('Route Not Found')

})

const errorHandler = (err, req, res, next) => {
    res.json({
        success: false,
        message: err.message
    })
}

module.exports = { notFound, errorHandler }