import {config as conf} from "dotenv";
conf();

const _config = {
    port: process.env.PORT,
    mongo_url: process.env.MONGO_URL,
    env: process.env.NODE_ENV,
    jwt_secret: process.env.JWT_SECRET,
    cloudinary_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    cors_origin: process.env.CORS_ORIGIN
}

export const config = Object.freeze(_config);