// const express = require("express"); // this won't work if the type is module in package.json file. And the type should be module if you want to deploy your project (I GUESS).
import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
// import { JsonWebTokenError } from "jsonwebtoken";

dotenv.config(); // by using this we can get all the variables in process.
const app = express();
const port = process.env.PORT || 3000; // || or (or) operator is used to condition it if the process.env.PORT does not work then the default port value will be 3000
const databaseUrl = process.env.DATABASE_URL;

//using the cors as middle to communicate between backend and frontend (they can be anywhere)
app.use(
  cors({
    // from where our request is to be made, ie. most likely to be the origin
    origin: process.env.ORIGIN,
    // what all the http methods can that request work on
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    // to enable cookies, we have to made credentials as true
    credentials: true,
  })
);

// cookieParser is used to get all the cookies from the frontend
app.use(cookieParser());

// using express middleware to get the body in json format or else we won't get any response. so we need a middleware to convert it for us so that we can easily make good use of body.
app.use(express.json());

//setting up all the routes here.
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to index page of SERVER");
});
//starting the server
const server = app.listen(port, () =>
  //github.com/10Yash10/Chat-App.git
  console.log(`Server is running at http://localhost/${port}`)
);

//connecting with database.
mongoose
  .connect(databaseUrl)
  .then(() => console.log("db connected"))
  .catch((error) =>
    console.log(
      "index.js :: connecting using mongoose :: Error :: ",
      error.message
    )
  );
