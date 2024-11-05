import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import web from './routers/web.js'
import cors from 'cors'


//Calling Functions & use Middlewares
const app = express()
app.use(express.json())
dotenv.config()
app.use(cors({}))
app.use('/image', express.static('public/image'));
app.use('/pdf', express.static('public/pdf'));


//Fetch the .env files 
const PORT = process.env.PORT
const URL = process.env.MONGODBURL


//connection with MongoDB
mongoose.set("strictQuery", false);
mongoose.connect(URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("DataBase Connected...")
}).catch(err => {
    console.log("Unable to Connect..." + err)
})

//Router 
web(app)
app.use((req, res) => {
    res.status(404).send("welcome HMS Backend || Made in kolkata with ❤️")
})

app.listen(PORT, () => {
    console.log(`Server Listening on port ${PORT}`)
})