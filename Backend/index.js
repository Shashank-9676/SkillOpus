import express from "express";
import 'dotenv/config';
import cors from 'cors';
import connectDB from './db.js';

import authRoutes from './routes/AuthRouter.js';

// Connect to MongoDB
connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("API is running...");
});

// Routes
import courseRoutes from './routes/CourseRoutes.js';
import enrollmentRoutes from './routes/EnrollmentRoutes.js';
import statsRoutes from './routes/StatsRoutes.js';
import progressRoutes from './routes/ProgressRoutes.js';
import optionsRoutes from './routes/OptionsRoutes.js';
import instructorRoutes from './routes/InstructorRoutes.js';
import organizationRoutes from './routes/OrganizationRoutes.js';

app.use('/api/', authRoutes);
app.use('/courses/', courseRoutes);
app.use('/enrollments/', enrollmentRoutes);
app.use('/stats/', statsRoutes);
app.use('/progress/', progressRoutes);
app.use('/form/', optionsRoutes);
app.use('/instructors/', instructorRoutes);
app.use('/organizations/', organizationRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
