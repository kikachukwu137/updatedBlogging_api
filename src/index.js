import express from 'express';
import mongoose from 'mongoose';
import winston from 'winston'; // Corrected the typo from 'wiston' to 'winston'
import dotenv from 'dotenv';
import userRouter from './routes/route.user.js';
import blogRouter from './routes/route.blog.js';

dotenv.config();

const app = express();
app.use(express.json());

// Winston configuration
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

// If we're not in production, log to the console as well
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

// Routes
app.use('/api/users', userRouter);
app.use('/api/blogs', blogRouter);

app.all("*",(req,res)=> {
    res.status(400).json({message: "route not found"})
})

// Database connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => logger.info('MongoDB connected'))
    .catch(err => logger.error(`MongoDB connection error: ${err}`));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
