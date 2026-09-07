const app = require('./app.js');
// const express = require('express');

const startServer = async() => {
    try{
        app.listen(3000 , () => {
            console.log("server is running");
        })
    }catch(error){
        console.log("server is not running" ,  error);
    }
}

startServer();