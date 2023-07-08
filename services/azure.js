const { BlobServiceClient } = require("@azure/storage-blob");
const azure = require('azure-storage');

// Create a connection string for your Azure Storage account
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME;

// Create a Blob service client
const blobService = azure.createBlobService(process.env.AZURE_STORAGE_CONNECTION_STRING);

// Create the container
blobService.createContainerIfNotExists(containerName, {
    publicAccessLevel: 'blob'
}, (error, result) => {
    if (error) {
        console.log("Error creating container:", error);
    } else {
        console.log("Container created successfully");
    }
});

// Upload a file to the container
exports.uploadImage = function uploadImage(file) {
    const blobName = file.filename;

    blobService.createBlockBlobFromLocalFile(containerName, blobName, file.file, (error, result) => {
        if (error) {
            console.log("Error uploading blob:", error);
        } else {
            console.log("Blob uploaded successfully");
        }
    });
};
