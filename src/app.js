import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import myRoutes from './routes/index.mjs'
import { createAdminAndRoles } from './libs/initialSetUp.js';

const app = express();
createAdminAndRoles();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api', myRoutes.authRoutes);
app.use('/api', myRoutes.clientRoutes);
app.use('/api', myRoutes.barberRoutes);
app.use('/api', myRoutes.roleRoutes);
app.use('/api', myRoutes.categorieRoutes);
app.use('/api', myRoutes.serviceRoutes);

export default app;