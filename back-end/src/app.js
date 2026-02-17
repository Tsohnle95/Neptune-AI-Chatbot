import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

app.use(cors({
// allow connections specified in .env 
  origin: process.env.ALLOWED_ORIGIN,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'ngrok-skip-browser-warning'],
  credentials: true
}));


//helps to debug by printing info to the terminal when requests are received by my server 
app.use(morgan('dev'));

//rate limiter: limits amount of requests per ip address per timer interval
const limiter = rateLimit({
    //units: minutes/seconds/miliseconds, the memory buffer will reset every 15 minutes
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

//lets express read json 
app.use(express.json());

// if url starts with /api, stop processing and send request to chatroutes file
app.use('/api', chatRoutes);

// 6. Basic Health Check (to see if server is alive)
app.get('/', (req, res) => {
  res.send('LLM Backend is active.');
});

export default app;

