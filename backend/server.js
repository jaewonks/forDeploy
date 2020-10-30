import express from 'express'
import mongoose from 'mongoose'
import userRoute from './routes/userRoute'
import dotenv from 'dotenv'
import path from 'path'
import productRoute from './routes/productRoute'
import orderRoute from './routes/orderRoute'
import uploadRoute from './routes/uploadRoute'
import config from './config/key'
import bodyParser from 'body-parser'

dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const mongodbUrl = config.mongoURL
    mongoose
        .connect(mongodbUrl,
        {
            useNewUrlParser: true, useUnifiedTopology: true,
            useCreateIndex: true, useFindAndModify: false
        })
        .then(() => console.log('MongoDB Connected...'))
        .catch(err => console.log(err));  

app.use(bodyParser.json())
app.use('/api/uploads', uploadRoute)
app.use('/api/users', userRoute)
app.use('/api/products', productRoute)
app.use('/api/orders', orderRoute)
app.get('/api/config/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
})

const __dirname = path.resolve()//return current folder 절대 경로 반환
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))
//concatenante current folder to upload folder 
//App.js Route
/* app.get('/api/products/:id', (req, res) => {
    const productId = req.params.id
    //DB data info
    const product = data.products.find( item => item._id === productId )
        if(product) //찾은 값이 일치한게 true이면
            res.send(product)
        else res.status(404).send({ message: 'Product Not Found.' })
            res.send(data.products) //data.js에서 products
}) */

const port = config.PORT

app.listen(port, () => {console.log(`Listening on http://localhost:${port}`)})