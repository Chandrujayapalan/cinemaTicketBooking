const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyparser = require('body-parser')
const controller = require('./routes/routes')
const cors = require('cors')
require("dotenv/config");
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => {
    console.log(error)
})
db.on('open', () => {
    console.log('Database is connected')
})
const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});

const PORT = process.env.PORT || 5002
app.listen(PORT, () => {
    console.log(`server is running ${PORT}`)

})
app.get("/", (req, res) => {
    res.status(200).send({
        status: 200,
        message: 'Api Running!'
    })
});
app.use('/api', controller)