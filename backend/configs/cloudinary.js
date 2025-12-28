import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import dotenv from "dotenv"
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Ensure .env is loaded (fallback in case it wasn't loaded in index.js)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '..', '.env') })

const uploadOnCloudinary = async(filePath)=>{
    // Validate Cloudinary environment variables
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.error('❌ Cloudinary configuration missing! Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file');
        console.error('Current values:', {
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing',
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'Set' : 'Missing',
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Missing'
        });
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath)
        }
        throw new Error('Cloudinary configuration is missing. Please configure your .env file with Cloudinary credentials.');
    }
    
    // Configure Cloudinary (do this every time to ensure fresh config)
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
    });
    
    try {
       if(!filePath){
        return null
       }
       
       // Check if file exists and get its stats
       if (!fs.existsSync(filePath)) {
           throw new Error('File does not exist at path: ' + filePath);
       }
       
       // Upload immediately - ensure file is uploaded right away
       const uploadResult = await cloudinary.uploader.upload(filePath, {
           resource_type: 'auto',
           use_filename: false,
           unique_filename: true,
           overwrite: false
       });
       
       // Clean up the temporary file
       if(fs.existsSync(filePath)){
           fs.unlinkSync(filePath)
       }
       
       return uploadResult.secure_url
    } catch (error) {
        // Clean up the temporary file on error
        if(fs.existsSync(filePath)){
            try {
                fs.unlinkSync(filePath)
            } catch (unlinkError) {
                console.error('Error deleting temp file:', unlinkError);
            }
        }
        
        // Provide more helpful error messages
        if (error.message && error.message.includes('Stale request')) {
            console.error('❌ Cloudinary stale request error - This usually means:');
            console.error('   1. Your system clock is incorrect. Please sync your system time.');
            console.error('   2. There was a delay in uploading the file.');
            throw new Error('Upload failed due to time synchronization issue. Please check your system clock and try again.');
        }
        
        console.error('Cloudinary upload error:', error);
        throw error;
    }
}
export default uploadOnCloudinary