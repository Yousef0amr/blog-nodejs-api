const multer = require('multer')




const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        const filename = `image-${Date.now()}.${ext}`;
        cb(null, filename)
    }
})


const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];

    if (imageType === 'image') {
        return cb(null, true);
    } else {
        return cb("error in load image", false);
    }
}


module.exports = {
    storage,
    fileFilter
}