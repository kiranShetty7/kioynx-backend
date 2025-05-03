const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            jwt.verify(token, process.env.SECRET, function (err, decoded) {
                if (err) {
                    res.status(401);
                    throw new Error("Unauthorized");
                }

            });
            next();
        } catch (error) {
            res.status(401);
            throw new Error("Unauthorized");
        }
    }

    if (!token) {
        res.status(401);
        throw new Error("Unauthorized");
    }
});

module.exports = { protect };