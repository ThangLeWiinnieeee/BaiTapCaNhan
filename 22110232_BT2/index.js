const express = require('express')
const path = require('path')
require('dotenv').config()
const databaseConfig = require('./config/database.config')
const userRoute = require('./routes/user.route')

const app = express()
const port = process.env.PORT


app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

databaseConfig.connectDatabase()

app.use(`/`, userRoute)

app.listen(port, () => {
    console.log(`Website đang chạy ở cổng ${port}`)
})