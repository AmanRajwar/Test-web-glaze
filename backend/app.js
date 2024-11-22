import dotenv from 'dotenv'
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ErrorMiddleware } from './middleware/error.js';
import routes from './routes/routes.js'

dotenv.config()
 const app = express();

// Load environment variables
dotenv.config();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// CORS => Cross-Origin Resource Sharing
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true,
}))

// Routes
app.use("/api/v1",routes);

// Testing API
app.get("/test", (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "API is working"
    });
});

// Unknown route
app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} not found`);
    err.statusCode = 404;
    next(err);
});

// Error middleware
app.use(ErrorMiddleware);

 export default app
