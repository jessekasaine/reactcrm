//import express
const express = require('express');
const db = require('../src/config/db')
const app = express();

//
app.get('/users', (req, res) =>{
    db.pool.query('SELECT * FROM users').then((result) => {
        return res.status(200).json(result.rows);
    }).catch((err) => {
        return res.status(500).json({
            error: err.message,
        })
    })
})

app.listen(3000, ()=>{
    return console.log(`Server started on port 3000`);
});