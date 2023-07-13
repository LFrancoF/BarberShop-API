import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import myRoutes from './routes/index.mjs'
import { createAdminAndRoles } from './libs/initialSetUp.js';

const app = express();
createAdminAndRoles();

app.use(cors({
    origin: true,
    credentials: true
}));

// app.use(
//     session({
//         resave: false,
//         saveUninitialized: false,
//         secret: 'session',
//         cookie: {
//             maxAge: 1000 * 60 * 60,
//             sameSite: 'none',
//             secure: true,
//         }
//     })
// )

app.use(morgan('dev'));
app.use(express.json({ limit: '20mb' }));
app.use(cookieParser());

app.use('/api', myRoutes.authRoutes);
app.use('/api', myRoutes.userRoutes);
app.use('/api', myRoutes.clientRoutes);
app.use('/api', myRoutes.barberRoutes);
app.use('/api', myRoutes.roleRoutes);
app.use('/api', myRoutes.categorieRoutes);
app.use('/api', myRoutes.serviceRoutes);
app.use('/api', myRoutes.citaRoutes);
app.use('/api', myRoutes.formRecomendRoutes);

export default app;