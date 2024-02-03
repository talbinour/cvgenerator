// import models
const express = require('express');
const mongoose = require('mongoose');
const morgan = require ('morgan');
const cors= require ('cors');
require("dotenv").config();

//app
const app=express();


//db
const mongoURI = 'mongodb://localhost:27017n';mongodb:

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

//middlweare
app.use(morgan("dev"));
app.use(cors({origin: true , credentials: true }));


//routes


//port
const port = process.env.PORT || 8080;

//listener 

const server = app.listen(port , ()=> console.log(`Server is running on port ${port}`));
