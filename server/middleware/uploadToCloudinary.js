// For practice, there are two options:
// upload to store files locally [more convenient and faster practice]
// uploadToCloudinary to store images in "Cloudinary"
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Use environment variables
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const userUploads = process.env.USER_UPLOADS;

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});
// // Generate a random string for unique naming purposes
// const generateRandomString = () => {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   let result = '';
//   for (let i = 0; i < characters.length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
//   return result;
// };

// Create a Cloudinary URL
const createCloudinaryURL = (userId, fileName) => {
  fileName = fileName.replace(/\.[^/.]+$/, ''); // Remove file extension
  return `${userUploads}/${userId}/${fileName}`;
};

// Request a resource by Public ID
const resourceRequest = async (userId, fileName) => {
  try {
    const result = await cloudinary.api.resource(createCloudinaryURL(userId, fileName));
    console.log('Result::::', result); // Log the result
  } catch (error) {
    console.error('Error fetching resource:', error);
  }
};

// Upload a file to Cloudinary
const uploadFileToCloudinary = (file, userId, tags, custom, fileName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `${userUploads}/${userId}`,
        public_id: `${Date.now()}-${fileName}`,
        tags: tags,
        context: custom,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(file.buffer);
  });
};

// Delete a single file from Cloudinary by public_id
const deleteFromCloudinary = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    console.log('Cloudinary delete result:', result);
    if (result.result !== 'ok') {
      throw new Error('Failed to delete file from Cloudinary');
    }
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error.message);
    throw error;
  }
};

// Middleware to upload files to Cloudinary
const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(); // No files, proceed to the next middleware
    }

    const tags = req.body.tags || '';
    const custom = {
      alt: req.params.userId || 'Default alt text',
      caption: req.body.caption || 'Default caption',
    };

    const uploadPromises = req.files.map(async (file) => {
      const fileName = file.originalname.replace(/\.[^/.]+$/, ''); // Remove file extension

      // Check if the resource already exists
      try {
        await cloudinary.api.resource(`${userUploads}/${req.params.userId}/${fileName}`);
      } catch (error) {
        if (error.error && error.error.http_code === 404) {
          console.log(`Resource not found, proceeding with upload: ${fileName}`);
        } else {
          console.error('Error checking resource:', error.message || error);
          throw error;
        }
      }

      // Upload to Cloudinary
      const result = await uploadFileToCloudinary(file, req.params.userId, tags, custom, fileName);
      return JSON.stringify({
        secure_url: result.secure_url,
        public_id: result.public_id,
      });
    });

    req.uploadedUrls = await Promise.all(uploadPromises);
    next();
  } catch (error) {
    console.error('Error uploading images to Cloudinary:', error.message || error);
    res.status(500).json({
      message: 'Failed to upload images',
      error: error.message || JSON.stringify(error),
    });
  }
};

// Middleware to delete a file from Cloudinary
uploadToCloudinary.deleteFiles = async (req, res, next) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ message: 'No public_id provided' });
    }

    console.log('deleteFiles Middleware: public_id:', public_id);

    await deleteFromCloudinary(public_id);
    next();
  } catch (error) {
    console.error(`Error deleting files: ${error.message}`);
    res.status(500).json({ message: 'Error deleting files', error: error.message });
  }
};

// Function to delete a folder in Cloudinary
const deleteFolderFromCloudinary = async (folderPath) => {
  try {
    const result = await cloudinary.api.delete_folder(folderPath);
    console.log(`Folder deleted successfully: ${folderPath}`);
    return result;
  } catch (error) {
    console.error(`Error deleting folder '${folderPath}':`, error.message || error);
    throw error;
  }
};

// Delete all files in a folder and then delete the folder
const deleteAllFilesInFolder = async (folderPath) => {
  try {
    const resources = await cloudinary.api.resources({
      type: 'upload',
      prefix: folderPath,
    });

    const publicIds = resources.resources.map((file) => file.public_id);

    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds);
    }

    await deleteFolderFromCloudinary(folderPath);
  } catch (error) {
    console.error('Error deleting files in folder:', error.message || error);
    throw error;
  }
};

// Middleware to delete all images in a folder
uploadToCloudinary.deleteAllImages = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const folderToDelete = `user-uploads/${userId}`;
    console.log('Deleting folder:', folderToDelete);

    await deleteAllFilesInFolder(folderToDelete);
    next();
  } catch (error) {
    console.error(`Error deleting images: ${error.message}`);
    res.status(500).json({ message: 'Error deleting images', error: error.message });
  }
};

module.exports = uploadToCloudinary;
