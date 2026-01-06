import express from 'express';
import authRoutes from './routes/auth.routes.js';
import chatRoutes from './routes/chat.routes.js';
import cookieParser from 'cookie-parser';
import cors from "cors";


const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://my-frontend.vercel.app" // add later
  ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get("/api/ff", (req, res) => {
  res.json({status: "success" });
});

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

export default app;
