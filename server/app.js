import express from "express";
import cors from "cors";
import router from "./router/authRouts.js";
import productRouter from "./router/productRoutes.js";
import adminEmailRouter from "./router/adminEmailRoutes.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(helmet({contentSecurityPolicy: false}));

app.use("/api/users",        router);
app.use("/api/products",     productRouter);
app.use("/api/admin-email",  adminEmailRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Backend is running"
  });
});

export default app;