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
// For converting things like special characters
// extended means can given more objects inside objects
app.use(express.urlencoded({extended: true, limit: "16kb"}));

app.use(express.static("public")); // file folder storing like public(folder name) assests

app.use(cookieParser());
// To set cookies and access from server in user browser

// routes import / here for file segregation
import userRouter from "./routes/user.routes.js";

// routes declaration / using middleware, we using router in another file
app.use("/api/v1/users", userRouter);
// /api/.. become prefix for all routes in this route.
// Further route after prefix handle to 


// should be defined as /api/v1/users to define as api and its version
// http:localhost:8000/api/v1/users/register


export { app };