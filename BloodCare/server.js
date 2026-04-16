import express from 'express';
import router from './routes/testRoutes.js';
import authrouter from './routes/authRoutes.js';
import dotenv from 'dotenv';
import colors from 'colors';
import morgan from 'morgan';
import cors from 'cors';
import { connctDB } from './config/db.js';
import protectedRoutes from './routes/protectedRoutes.js';

// dot config
dotenv.config();

// mongodb connection
connctDB();

// rest object
const app = express();

// middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// routes
 /* app.get('/test',(req,res) => {
    res.status(200).json({
        message : "Welcome user",
    });
}); */

app.use("/api/v1/test", router);
app.use("/api/v1/auth", authrouter);


//port

const PORT = process.env.PORT || 8080;

// listen

app.listen(PORT,()=>{
    console.log(`Node server running in ${process.env.DEV_MODE} ModeOn Port ${PORT}`);
})