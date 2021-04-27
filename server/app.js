import express from 'express'
import sequelize from "./database/connection.js";
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/task.js';
import AuthMiddleware from "./middlewares/AuthMiddleware.js";

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/task', AuthMiddleware, taskRoutes);

export default app;