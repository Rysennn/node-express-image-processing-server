const { Router } = require('express');
const multer = require('multer');
const imageProcessor = require('./imageProcessor');
const path = require('path');
const { response } = require('../app');

const photoPath = path.resolve(__dirname, '../../client/photo-viewer.html');

const router = Router();

const filename = (request, file, callback) => {
    callback(null, file.originalname);
};

const storage = multer.diskStorage({
    destination: 'api/uploads/',
    filename,
});

const fileFilter = (request, file, callback) => {
    if (file.mimetype !== 'image/png') {
        request.fileValidationError = 'Wrong file type';
        callback(null, false, new Error('Wrong file type'));
    } else {
        callback(null, true);
    }
}

const upload = multer ({
    fileFilter,
    storage,
});

router.post('/upload', upload.single('photo'), async(request, response) =>{
    if (request.fileValidationError) return response.status(400).json({error: request.fileValidationError});

    try {
        await imageProcessor(request.file.filename)
    }catch{

    }

    return response.status(201).json({sucess: true});
});

router.get('/photo-viewer', (request, response) => {
    response.sendfile(photoPath);
});


module.exports = router;