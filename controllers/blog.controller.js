const mongoose = require("mongoose");
const asyncWrapper = require("../middlewares/asyncWrapper");
const Blog = require('../models/Blog.model');
const User = require('../models/User.model');

const getAllBlogs = asyncWrapper(
    async (req, res, next) => {
        const blogs = await Blog.find({}, { _v: false });
        return res.status(200).json({
            status: 'SUCCESS',
            data: {
                blogs
            }
        })
    }
)
const get_blog = asyncWrapper(
    async (req, res, next) => {
        const blogId = req.params.id
        const blog = await Blog.findById(blogId, { _v: false });
        if (!blog) {
            return res.status(404).json({ status: 'FAIL', message: "blog not found" })
        }
        return res.status(200).json({ status: "SUCCESS", data: { blog } })
    }
)


const get_user_blog = asyncWrapper(
    async (req, res, next) => {

        const user = await User.findById(req.userId, { _v: false }).populate('blogs');

        return res.status(200).json({ status: "SUCCESS", data: { blogs: user.blogs } })
    }
)


const add_blog = asyncWrapper(
    async (req, res, next) => {
        const user = await User.findById(req.userId);

        const blog = Blog({
            ...req.body,
            user: user._id,
            image: req.file.filename
        })
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({ session });

        user.blogs.push(blog)
        await user.save({ session })

        await session.commitTransaction()

        return res.status(201).json({ status: 'SUCCESS', data: { blog } })
    }
)

const update_blog = asyncWrapper(
    async (req, res, next) => {
        const blogId = req.params.id;
        const blog = await Blog.findByIdAndUpdate(blogId, { ...req.body }, { new: true, _v: false });

        if (!blog) {
            return res.status(404).json({ status: 'FAIL', message: "blog not found" })
        }
        return res.status(200).json({ status: 'SUCCESS', data: { blog } })
    }
)

const delete_blog = asyncWrapper(
    async (req, res, next) => {
        const blogId = req.params.id;
        await Blog.findByIdAndDelete(blogId).populate('user').then(blog => {
            if (!blog) {
                return res.status(404).json({ status: 'FAIL', message: "blog not found" })
            }
            blog.user.blogs.pull(blog);
            blog.user.save();
            return res.status(200).json({ status: 'SUCCESS', data: null })
        });
    }
)


module.exports = {
    getAllBlogs,
    get_blog,
    add_blog,
    update_blog,
    delete_blog,
    get_user_blog
}