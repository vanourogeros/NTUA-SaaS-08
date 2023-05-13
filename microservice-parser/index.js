const express = require('express');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' }); // uploads will be stored in an "uploads" directory in your project

const app = express();

app.post('/api/upload', upload.single('file'), (req, res) => {
    // req.file is the uploaded file object
    console.log(req.file);
    res.json({ status: 'OK' });
});

app.listen(3001, () => {
    console.log('Server is up and running on port 3001');
});
