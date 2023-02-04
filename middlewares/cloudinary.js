const multer = require('multer')
const { storage } = require('../cloudinary/index')

exports.upload = multer({ storage })