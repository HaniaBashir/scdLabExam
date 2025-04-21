import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import AuthRoute from './Routes/AuthRoute.js';
import UserRoute from './Routes/UserRoute.js';
import PostRoute from './Routes/PostRoute.js';
import UploadRoute from './Routes/UploadRoute.js';
import HealthRoute from './Routes/HealthRoute.js';

const app = express();

dotenv.config();

app.use(express.static('public'));
app.use('/images', express.static('images'));

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use('/health', HealthRoute);

mongoose.connect(
  process.env.MONGO_DB, 
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => {
  app.listen(process.env.PORT, () => 
    console.log(`Server running on port ${process.env.PORT}`)
  );
})
.catch((error) => {
  console.log('Database connection error:', error);
});

// uses of routes
app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
app.use('/post', PostRoute);
app.use('/upload', UploadRoute);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});

export default app; 