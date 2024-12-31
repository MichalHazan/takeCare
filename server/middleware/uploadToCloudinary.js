const cloudinary = require('cloudinary').v2;

const CLOUDINARY_CLOUD_NAME='dcu0bkhp2'
const CLOUDINARY_API_KEY='229122944558319'
const CLOUDINARY_API_SECRET='GtrWrqcbtbpKXf8W0hgkovOTiOs'
const userUploads ='user-uploads'

// הגדרת Cloudinary
cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});
//For work purposes, use a random username. When finished, delete and restore the original file name.
const generateRandomString = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < characters.length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

const createCloudinaryURL = (userId, fileName) => {
    fileName= file.originalname.replace(/\.[^/.]+$/, '');
    return `${userUploads}/${userId}/${fileName}`;
  };

const resourceRequest= async (userId, fileName) => {
    try {
      // בקשה למשאב על פי Asset ID
      const result = await cloudinary.api.resource(createCloudinaryURL = (userId, fileName))
      //console.log('Result::::', result); // הדפסת התוצאה
    } catch (error) {
      // טיפול בשגיאה
      console.error('Error fetching resource:', error);
    }
  }
  
const uploadFileToCloudinary = (file, userId, tags, custom, fileName) => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder: `${userUploads}/${userId}`,
                public_id:generateRandomString(),
               //public_id:fileName,
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

const uploadImagesToCloudinary = async (req, res, next) => {
    //resourceRequest(req.params.userId,'ABIK (2)')

    try {
      if (!req.files || req.files.length === 0) {
        return next(); // אין קבצים, המשך לבקשה הבאה
      }
  
      const tags = req.body.tags || '';
      const custom = {
        alt: req.params.userId || 'Default alt text',
        caption: req.body.caption || 'Default caption',
      };
      
      const uploadPromises = req.files.map(async (file) => {
        const fileName = file.originalname.replace(/\.[^/.]+$/, ''); // הסרת סיומת

        //const urlR =`${userUploads}/${req.params.userId}/${fileName}`
        // בדיקה אם המשאב כבר קיים
        //For work purposes, use a random username. When finished, delete and restore the original file name.
        try {
          await cloudinary.api.resource(`${userUploads}/${req.params.userId}/${fileName}`);
        //   throw new Error(
        //     `A resource with the Public ID "${fileName}" already exists. Rename the file or use a different folder.`
        //   );
        } catch (error) {
            if (error.error && error.error.http_code === 404) {
              // המשאב לא נמצא, המשך להעלאה
              console.log(`Resource not found, proceeding with upload: ${fileName}`);
            } else {
              // טיפול בשגיאות אחרות
              console.error('Error checking resource:', error.message || error);
              throw error; // זרוק את השגיאה להמשך טיפול
            }
          }
    
          // העלאה ל-Cloudinary
          //return await uploadFileToCloudinary(file, req.params.userId, tags, custom, publicId);
          let result = await uploadFileToCloudinary(file, req.params.userId, tags, custom, fileName);
          console.log(result)
          result={secure_url: result.secure_url,asset_id: result.asset_id}
            result=JSON.stringify(result)
      return result
        });
  
      const uploadedUrls = await Promise.all(uploadPromises);
      console.log('Uploaded URLs:', uploadedUrls);

  
      req.uploadedUrls = uploadedUrls; // שמירת כתובות ה-URL בבקשה
      next(); // המשך לנתיב הבא
    } catch (error) {
      // טיפול בשגיאה
      console.error('Error uploading images to Cloudinary:', error.message || error); // הצגת שגיאה מלאה אם אין message
      res.status(500).json({
        message: 'Failed to upload images',
        error: error.message || JSON.stringify(error), // הצגת תוכן השגיאה
      });
    }
  };
  
  module.exports = uploadImagesToCloudinary;
  