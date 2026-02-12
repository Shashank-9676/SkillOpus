import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'skillopus-courses',
        resource_type: 'video', // Explicitly state resource type for videos
        allowed_formats: ['mp4', 'mkv', 'avi', 'mov'],
    },
});

export const upload = multer({ storage: storage });
