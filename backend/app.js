import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
//router imports
import healthCheckRouter from "./src/routes/healthcheck.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import bookRoutes from "./src/routes/book.routes.js";
import reviewRoutes from "./src/routes/reviews.routes.js";

const app = express();

app.use(
  cors({
    origin:
      process.env.CORS_ORIGIN === "*"
        ? "*"
        : process.env.CORS_ORIGIN?.split(",") || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

// Routes
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/books", bookRoutes)

export default app;
