import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

app.use(cors({
    //origin of allowed connections
  origin: ['http://localhost:5173', 'https://tsohnle95.github.io'] //allow all origins for testing
 // We only expect POST requests
//   origin: 'https://tsohnle95.github.io'
}));


//helps to debug by printing info to the terminal when requests are received by my server 
app.use(morgan('dev'));

//rate limiter: limits amount of requests per ip address per timer interval
const limiter = rateLimit({
    //units: minutes/seconds/miliseconds, the memory buffer will reset every 15 minutes
  windowMs: 15 * 60 * 1000, 
  max: 2000, 
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

//security: define who is allowed to connect and use the app

//lets express read json 
app.use(express.json());

// if url starts with /api, stop processing and send request to chatroutes file
app.use('/api', chatRoutes);

// 6. Basic Health Check (to see if server is alive)
app.get('/', (req, res) => {
  res.send('LLM Backend is active.');
});

export default app;

