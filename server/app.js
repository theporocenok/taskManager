import express from 'express'
import sequelize from "./database/connection.js";
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.js';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/task.js';
import AuthMiddleware from "./middlewares/AuthMiddleware.js";

const app = express();

let corsOptions = {
  origin: "*",
};

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.options('*', cors(corsOptions));

app.use('/api/auth', cors(corsOptions), authRoutes);
app.use('/api/users', cors(corsOptions), AuthMiddleware, userRoutes);
app.use('/api/tasks', cors(corsOptions), AuthMiddleware, taskRoutes);

export default app;