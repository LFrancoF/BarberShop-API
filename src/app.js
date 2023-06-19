import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import authRoutes from "./routes/auth.routes.js";
import clientRoutes from "./routes/clients.routes.js";
import barberRoutes from "./routes/barbers.routes.js";
import { createAdminAndRoles } from './libs/initialSetUp.js';

const app = express();
createAdminAndRoles();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);
app.use('/api', clientRoutes);
app.use('/api', barberRoutes);

export default app;