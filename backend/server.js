import app from './src/app.js'
import dotenv from 'dotenv'

/* Database Part*/
import connectDb from './src/config/db.js'
dotenv.config()
connectDb();
/*--------------*/

app.listen(process.env.PORT, () => {
    console.log(`Server started at localhost:${process.env.PORT}`)
})