import express from 'express';
import cors from "cors";
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))  

 app.use(express.json({limit: "16kb"}))
 app.use(express.urlencoded({extended: true, limit: "16kb"}))
 app.use(express.static("public"))
 app.use(morgan("dev"))
 app.use(cookieParser())

 app.get("/", (req, res) => {
   res.send({
     server: "Express",
     status: "OK",
   });
 });




 //routes

 import userRouter from "./routes/user.routes.js";


 //routes declaration
app.use("/api/v1/users", userRouter)       //http://localhost:3000/api/v1/users/  further jo user route mein define h



export {app}