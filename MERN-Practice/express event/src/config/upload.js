//dpendencies
const multer = require('multer');
const path = require("path");

//upload file
module.exports = {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, "..", "..", "files"),
        filename: (req, file, cb) => {
            //file name structure
            const ext = path.extname(file.originalname)
            const name = path.basename(file.originalname, ext)
            //make sure there is no space in the file name
            //and add the date
            cb(null, `${name.replace(/\s/g, "")}-${Date.now()}${ext}`)
        }

    })
}