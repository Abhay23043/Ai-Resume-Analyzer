import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

import authRouter from "./routes/auth.route.js";
import interviewRouter from "./routes/interview.route.js";

dotenv.config();

const app = express();

// ===============================
// CORS
// ===============================

const allowedOrigins = [
    process.env.FRONTEND_URI,
    "http://localhost:5173",
    "http://localhost:3000"
].filter(Boolean);

console.log("FRONTEND_URI:", process.env.FRONTEND_URI);

app.use(cors({
    origin: (origin, callback) => {

        // Allow requests without an Origin
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.log("❌ CORS blocked:", origin);

        return callback(new Error("Not allowed by CORS"));
    },

    credentials: true
}));

// ===============================
// Middleware
// ===============================

app.use(express.json());

app.use(cookieParser());

// ===============================
// Routes
// ===============================

app.use("/api/auth", authRouter);

app.use("/api/interview", interviewRouter);

export default app;