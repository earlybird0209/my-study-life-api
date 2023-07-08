const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

AWS.config.update({
    accessKeyId: 'your_access_key_id',
    secretAccessKey: 'your_secret_access_key',
});


const s3 = new AWS.S3({
  params: {
    Bucket: 'your_bucket_name',
  },
});


// app.post('/upload', multerS3({
//     s3: s3,
//     bucket: 'your_bucket_name',
//     key: (req, file, cb) => {
//         cb(null, Date.now().toString() + file.originalname);
//     },
// }).array('files'), (req, res) => {
//     // Handle the uploaded files here
//     res.send('Files uploaded successfully');
// });