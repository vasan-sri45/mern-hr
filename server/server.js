import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import authRouter from './router/authRoutes.js';
import adminRouter from './router/adminRoutes.js';
import employeeRouter from './router/employeeRoutes.js';
import tableRouter from './router/tableRoutes.js';
import attendenceRouter from './router/attendenceRoutes.js';
import messageRouter from './router/messageRoutes.js';
import personalRouter from './router/PersonalRoutes.js';
import ticketRouter from './router/ticketRoutes.js';
import folderRouter from './router/folderRoutes.js';
    
dotenv.config();
const app = express();
const Port = process.env.PORT || 4500;

app.use(express.json());
app.use(cookieParser());

// const ORIGINS = [
//   process.env.CLIENT_ORIGIN,           // production frontend (https)
//   'http://localhost:5173',             // Vite dev
// ];

app.use(cors({
  origin(origin, cb) {
    const allow = [process.env.CLIENT_ORIGIN, 'http://localhost:5173'].filter(Boolean);
    if (!origin || allow.includes(origin)) return cb(null, true);
    return cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));
// const corsOptions = (cors({
//   origin(origin, cb) {
//     // allow same-origin or non-browser requests (no Origin header)
//     if (!origin) return cb(null, true);
//     if (allowedOrigins.includes(origin)) return cb(null, true);
//     return cb(new Error(`Not allowed by CORS: ${origin}`));
//   },
//   credentials: true,
//   methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
//   allowedHeaders: ['Content-Type','Authorization'],
// }));
// const corsOptions = (cors({
//   origin(origin, cb) {
//     // allow same-origin or listed origins
//     if (!origin || ORIGINS.includes(origin)) return cb(null, true);
//     return cb(new Error('Not allowed by CORS'));
//   },
//   credentials: true,
//   methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
//   allowedHeaders: ['Content-Type','Authorization']
// }));
// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions));
// app.options('*', cors());

// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true,
//   methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
//   allowedHeaders: ['Content-Type','Authorization']
// }));

// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true,
// }));

// app.options('*', cors({
//   origin: allowedOrigins,
//   credentials: true,
// }));
// app.use(express.static(__dirname,'/uploads'));

app.use('/api/auth',authRouter);
app.use('/api/data',adminRouter);
app.use('/api/employee',employeeRouter);
app.use('/api/table',tableRouter);
app.use('/api/attendance',attendenceRouter);
app.use('/api/message',messageRouter);
app.use('/api/personal',personalRouter);
app.use('/api/support', ticketRouter);
app.use('/api/folder', folderRouter);

app.set('trust proxy', 1);

app.listen(Port,()=>{
    console.log(`server is running : ${Port}`);
    connectDB();
});