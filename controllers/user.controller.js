const asyncWrapper = require('../middlewares/asyncWrapper')
const User = require('../models/User.model')
const bcrypt = require('bcrypt')
const generateToken = require('../utils/generateToken')

const getAllUsers = asyncWrapper(
    async (req, res, next) => {
        const users = await User.find({}, { _v: false, password: false }).populate("blogs")

        return res.status(200).json({ status: 'Success', data: { users } })
    }
)

const signup = asyncWrapper(
    async (req, res, next) => {
        const { name, email, password } = req.body
        const user = User({
            name,
            email,
            password: bcrypt.hashSync(password, 10),
            blogs: []
        })
        await user.save();
        const token = generateToken({
            id: user._id,
            email: user.email
        })
        return res.status(200).json({ status: 'Success', data: { token } })
    }
)


const login = asyncWrapper(
    async (req, res, next) => {
        const { email, password } = req.body
        const user = await User.findOne({ email: email }, { _v: false });
        if (!user) {
            return res.status(404).json({ status: 'FAIL', message: "user not found" })
        }
        const isValid = bcrypt.compareSync(password, user.password)
        if (!isValid) {
            return res.status(400).json({ status: 'FAIL', message: "wrong password" })
        }
        const token = generateToken(
            {
                id: user._id,
                email: user.email
            }
        )
        return res.status(200).json({ status: 'SUCCESS', data: { token } })
    }
)


module.exports = {
    getAllUsers,
    signup,
    login
}