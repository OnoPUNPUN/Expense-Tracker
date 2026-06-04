import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import redisClient from "./src/config/redisClinet";


const app = express();
await redisClient.connect();
const PORT = process.env.PORT || 5003;

const __fileName = fileURLToPath(import.meta.url);
const __dirName = dirname(__fileName);


app.use("/", (req, res) => {
    res.json({
        status: "OK",
        service: "Dev Blog API"
    });
});