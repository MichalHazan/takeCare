// For practice, there are two options
// upload to store files in Blockly [more convenient and faster practice]
// uploadToCloudinary to store images in "cloudinary"

const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Define the upload directory path
const uploadPath = path.join(__dirname, "../uploads");
// console.log('uploadPath',uploadPath)
// Check if the directory exists; create it if not
try {
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true }); // Create the directory
        console.log(`Directory created: ${uploadPath}`);
    } else {
        console.log(`Directory exists: ${uploadPath}`);
    }
} catch (error) {
    console.error(`Error checking/creating directory: ${error.message}`);
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath); // Set the upload directory
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`; // Unique filename
        cb(null, uniqueName);
    },
});

// Create Multer instance
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // File size limit: 5MB
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file
        } else {
            cb(new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed."));
        }
    },
});




// Middleware to process uploaded files and return file details
upload.processFiles = async (req, res, next) => {
    try {
        //console.log(req)
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const uploadResults = files.map((file) => {
         
        const secure_url = `http://localhost:2000/uploads/${encodeURIComponent(file.filename)}`;
            const result = {
                secure_url:secure_url,
                public_id: file.filename,
            };     

            return JSON.stringify(result);
        });
        
      
        req.uploadedUrls = uploadResults;
        next();
    } catch (error) {
        console.error(`Error processing files: ${error.message}`);
        res.status(500).json({ message: "Error processing files", error: error.message });
    }
};


upload.deleteFiles = async (req, res, next) => {
  try {
    // Extract public_id from the request body
    const { public_id } = req.body;

    // Check if public_id is provided
    if (!public_id) {
        return res.status(400).json({ message: "No public_id provided" });
      }  

    // Log the public_id to the console
    console.log('deleteFiles Middleware: public_id:', public_id, '============');
  
    // Define the file path
    const filePath = path.join(uploadPath, public_id);

    console.log('===========filePath', filePath, '============');

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file at ${filePath}:`, err.message);
        return res.status(500).json({ message: "Error deleting file", error: err.message });
      }

      console.log(`File deleted successfully: ${filePath}`);
      
      // Move to the next middleware or route handler
      next();
    });
  } catch (error) {
    console.error(`Error deleting files: ${error.message}`);
    res.status(500).json({ message: "Error deleting files", error: error.message });
  }
};

// Middleware to handle Multer errors
upload.handleError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error(`Multer error: ${err.message}`);
        return res.status(400).json({ message: `Multer error: ${err.message}` });
    } else if (err) {
        console.error(`Unknown error: ${err.message}`);
        return res.status(500).json({ message: `Unknown error: ${err.message}` });
    }
    next();
};

module.exports = upload;
