const AWS = require('aws-sdk');
const fs = require('fs');

const spacesEndpoint = new AWS.Endpoint(process.env.DIGITAL_OCEAN_SPACES_ENDPOINT);
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DIGITAL_OCEAN_ACCESS_KEY,
    secretAccessKey: process.env.DIGITAL_OCEAN_SECRET_KEY
});


// Upload a file to the container
exports.uploadImage = async function uploadImage(pathToImage, imageName) {

    return new Promise((resolve, reject) => {
        const file = fs.createReadStream(pathToImage);

        const params = {    
            Bucket: process.env.DIGITAL_OCEAN_BUCKET,
            Key: imageName,
            Body: file,
            ACL: 'public-read'
        };

        s3.putObject(params, function (err, data) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                console.log("Successfully uploaded image to " + params.Bucket + '/' + params.Key);
                
                resolve(true);

                // remove the file from the local filesystem
                fs.unlink(pathToImage, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                
                    console.log('File deleted successfully');
                });
            }
        });

        
    });

};


// Delete a file from the container
exports.deleteImage = async function deleteImage(imageName) {
    
    const params = {
        Bucket: process.env.DIGITAL_OCEAN_BUCKET,
        Key: imageName
    };

    await s3.deleteObject(params, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully deleted image from " + params.Bucket + '/' + params.Key);
        }
    });
    
};


