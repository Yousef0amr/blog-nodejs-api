const { sign } = require("jsonwebtoken")


module.exports = (payload, time = '1d') => {
    const secret = process.env.SECRET
    return sign(payload, secret, { expiresIn: time })
}