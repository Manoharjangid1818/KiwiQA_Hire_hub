import express from "express";
import serverless from "serverless-http";
import session from "express-session";
// add other middlewares and routes here

const app = express();
app.use(express.json());
// ...your existing routes

app.get("/api/hello", (req,res)=>res.json({message:"Hello from API"}));

export default serverless(app);