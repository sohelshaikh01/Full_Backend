import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
// cors configuration

// Config that accepting json & limit data size
app.use(express.json({limit: "16kb"}));
// For coverting things like special characters
// extended means can given more objects inside objects
app.use(config.urlEncoded({extended: true, limit: "16kb"}));

app.use(express.static("public")); // file folder storing like public(folder name) assests

app.use(cookieParser());
// To set cookies and access from server in user browser


export { app };