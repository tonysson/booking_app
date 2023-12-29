import express ,{Request , Response} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';

import "dotenv/config";
import path from 'path';

// CONNECT TO MONGODB
mongoose.connect(process.env.CONNECTION_STRING as string).then(() => {
    console.log("Connected to MongoDB:");
})

// initialize express
const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended : true}))
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials : true
}));

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.use('/api/users', userRoutes)
app.use('/api/auth' , authRoutes);

app.listen(7000, () => {
    console.log("listening on http://localhost:7000")
})