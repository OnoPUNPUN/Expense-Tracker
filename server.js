import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import redisClient from "./src/config/redisClinet.js";
import authRouter from "./src/routes/auth.routes.js"


const app = express();
await redisClient.connect();
const PORT = process.env.PORT || 5003;

const __fileName = fileURLToPath(import.meta.url);
const __dirName = dirname(__fileName);


app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        status: "OK",
        service: "ExpenseEase Server Running"
    });
});

app.use("/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Server has Started on http://localhost:${PORT}`);
});
