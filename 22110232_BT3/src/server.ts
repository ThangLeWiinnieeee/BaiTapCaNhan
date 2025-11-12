import express from 'express';
import bodyParser from 'body-parser';
import viewEngine from './config/viewEngine';
import initWebRoutes from './routes/web.route';
import connectDB from './config/database';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 6969; 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
initWebRoutes(app);
connectDB();

app.listen(port, () => {
  console.log(`Backend Nodejs is running on the port: ${port}`);
});