require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const routes = require('./routes')
app.use(routes)


const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)
.then(() => {
    console.log('Connected')
    app.emit('Database')
})
.catch((e) => console.log(e))


app.on('Database', () => {
    app.listen(port, () => {
        console.log('Server is running')
    })
})

