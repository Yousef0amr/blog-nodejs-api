const express = require("express");

const blogRouter = express.Router();
const blogController = require('../controllers/blog.controller');
const { storage, filter } = require('../utils/uploadFile')
const multer = require('multer');

const upload = multer({
    storage: storage,
    fileFilter: filter
})


blogRouter.route('/')
    .get(blogController.getAllBlogs)
    .post(upload.single('image'), blogController.add_blog);

blogRouter.route('/user_blogs')
    .get(blogController.get_user_blog);

blogRouter.route('/:id')
    .get(blogController.get_blog)
    .patch(blogController.update_blog)
    .delete(blogController.delete_blog);



module.exports = blogRouter



