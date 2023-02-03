const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'shopping-site',
    allowedFormats: ['jpeg', 'png', 'jpg', 'webp', 'avif']
  }
})

const cloudinaryDelete = (url, file) => {
    let extractedString = url.split('/')
    let fileNameArray = new Array(extractedString[7], extractedString[8])
    let fileNameFormat = fileNameArray.join('/')
    let newString = fileNameFormat.split('.')[0]

    return cloudinary.uploader.destroy(newString, (error, result) => {
      if (error) {
        if (error.errno == -3001 && file) {
          cloudinary.uploader.destroy(req.file.filename)
          res.send({message: "Experiencing connection problems, couldn't update image"})
        }
        console.log(error)
      }
      result && console.log({ result })
    })
}

module.exports = {
  cloudinary,
  storage,
  cloudinaryDelete
}
