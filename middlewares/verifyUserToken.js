const User = require("../models/User.model");
const asyncWrapper = require("./asyncWrapper");
const jwt = require('jsonwebtoken')

const verify_user = asyncWrapper(
    async (req, res, next) => {
        const authorizationHeader = req.headers.authorization

        const token = authorizationHeader && authorizationHeader.split(' ')[1];

        const decodedToken = jwt.verify(token, process.env.SECRET);

        // Access the decoded payload if needed
        const userId = decodedToken.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }
        // Proceed with protected route logic...
        req.userId = userId
        next();

    }
)


module.exports = verify_user