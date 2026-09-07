const app = require('./app.js');
// const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

dotenv.config();

const startServer = async() => {
    try{
        await connectDB();
        app.listen(3000 , () => {
            console.log("server is running");
        })
    }catch(error){
        console.log("server is not running" ,  error);
    }
}

startServer();