import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import chatRoutes from './routes/chatRoutes.js';

const app = express();

//tells express to trust the first proxy it encounters (which is ngrok tunnel) to allow the rate limiter to see the user's actual ip address instead of seeing Ngrok's ip for every single person
app.set('trust proxy', 1); 

const origins = process.env.ALLOWED_ORIGIN.split(',');
app.use(cors({
// allow connections specified in .env 
  origin: origins,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'ngrok-skip-browser-warning'],
  credentials: true
}));


morgan.token('local-time', function (req, res) {
  return new Date().toLocaleString(); // this uses my computer's system clock to find time, which we pass into the code below to log the time in the console
});
//helps to debug by printing info to the terminal when requests are received by my server 
app.use(morgan(':method :url :status :response-time ms - [:local-time] - :user-agent :req[x-forwarded-for]'));
//displays this info in the console for a single request: 
//1|llm-api  | POST /api/chat 200 309.392 ms - [2/17/2026, 9:11:30 PM] - Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 xxx.x.xxx.xxx

//heartbeat api
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});

//rate limiter: limits amount of requests per ip address per timer interval
const limiter = rateLimit({
    //units: minutes/seconds/miliseconds, the memory buffer will reset every 15 minutes
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  validate: { xForwardedForHeader: false }, 
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

//lets express read json 
app.use(express.json());

// if url starts with /api, stop processing and send request to chatroutes file
app.use('/api', chatRoutes);

// basic Health Check (to see if server is alive)
app.get('/', (req, res) => {
  res.send('LLM Backend is active.');
});

export default app;



