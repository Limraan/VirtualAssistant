import multer from "multer";
import path from 'path';
import crypto from 'crypto';

let storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./public")
    },
    filename:(req,file,cb)=>{
        // Generate unique filename with timestamp and random string to avoid conflicts
        const randomString = crypto.randomBytes(8).toString('hex');
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const uniqueName = `${timestamp}-${randomString}${ext}`;
        cb(null, uniqueName);
    }
})

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
})

export default upload