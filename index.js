import express from 'express';
import { config } from 'dotenv';
import { initiateApp } from './src/initiate-app.js';
config();
const app = express();
initiateApp({app, express});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});