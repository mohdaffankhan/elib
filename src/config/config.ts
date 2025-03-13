import {config as conf} from "dotenv";
conf();

const _config = {
    port: process.env.PORT,
    mongo_url: process.env.MONGO_URL,
    env: process.env.NODE_ENV
}

export const config = Object.freeze(_config);