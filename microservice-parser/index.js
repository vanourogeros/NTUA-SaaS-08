const express = require('express');
const multer  = require('multer');
const fs = require('fs');
const upload = multer({ dest: 'uploads/' }); // uploads will be stored in an "uploads" directory in your project

const app = express();

app.post('/api/upload', upload.single('file'), (req, res) => {
    // req.file is the 'file' object
    // req.file.path is path to the uploaded file

    fs.readFile(req.file.path, 'utf8', (err, data) => {
        if (err) {
            console.log('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        console.log('File contents:', data);
        res.json({ status: 'OK' });
    });
});

app.listen(3001, () => {
    console.log('Server is up and running on port 3001');
});
