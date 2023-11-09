const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user.route');
const blogRouter = require('./routes/blog.route');
const verify_user = require("./middlewares/verifyUserToken");
require('dotenv').config();


const app = express();

const api = process.env.BASE_URL

app.use(express.json())

app.use(`${api}/users`, userRouter)
app.use(`${api}/blogs`, verify_user, blogRouter)

app.all('*', (req, res) => {
    res.status(404).json({ msg: "this resource not found" })
})

app.use((error, req, res, next) => {
    res.status(404).json({ msg: error.message })
})


mongoose.connect(process.env.MONGO_URL)
    .then(() =>
        app.listen(process.env.PORT)
    ).then(() =>
        console.log(`listening to port ${process.env.PORT} and connected to mongodb`)
    ).catch((e) => {
        console.log(e);
    })

