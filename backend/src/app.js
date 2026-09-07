const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.route');
app.use(express.json());

// app.use('/' , (req,res) => {
//    res.send("hello there!");
// })

app.use('/api/auth',authRoutes);

app.use((req,res) => {
    res.status(404).json({msg : "route not found"});
})

module.exports = app;