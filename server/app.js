import express from 'express'
import sequelize from "./database/connection.js";
import morgan from 'morgan';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/task.js';

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/task', taskRoutes);

export default app;