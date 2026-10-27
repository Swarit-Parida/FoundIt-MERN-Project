import 'dotenv/config';
import express from 'express'; import cors from 'cors'; import helmet from 'helmet'; import morgan from 'morgan'; import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js'; import authRoutes from './routes/authRoutes.js'; import itemRoutes from './routes/itemRoutes.js'; import { notFound, errorHandler } from './middleware/errorHandler.js';
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) { console.error('JWT_SECRET must be set to a random secret of at least 32 characters.'); process.exit(1); }
const app = express();
app.disable('x-powered-by'); app.use(helmet()); app.use(cors({ origin: (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map(s=>s.trim()), methods: ['GET','POST','PATCH','DELETE','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'] }));
app.use(express.json({ limit: '20kb' })); app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api/auth', rateLimit({ windowMs: 15*60*1000, limit: 60, standardHeaders: 'draft-7', legacyHeaders: false, message: { message: 'Too many authentication requests. Please try again later.' } }));
app.get('/api/health', (req,res)=>res.json({ status:'ok', service:'FoundIt API', timestamp:new Date().toISOString() }));
app.use('/api/auth',authRoutes); app.use('/api/items',itemRoutes); app.use(notFound); app.use(errorHandler);
const port = process.env.PORT || 5000;
connectDB().then(()=>app.listen(port,()=>console.log(`FoundIt API listening on port ${port}`))).catch(err=>{console.error('Could not start FoundIt API:',err.message);process.exit(1)});
