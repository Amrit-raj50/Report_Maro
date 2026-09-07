const express = require('express');
const app = express();

app.use(express.json());

app.use('/' , (req,res) => {
   res.send("hello there!");
})

app.use((req,res) => {
    res.status(404).json({msg : "route not found"});
})

module.exports = app;