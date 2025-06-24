require('dotenv').config()

const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')

const userRoutes = require('./routes/user')
const blogRoutes = require('./routes/blog')

const Blog = require('./models/blog')

const checkToken = require('./middlewares/auth')

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URL)
.then(e => {
    console.log("MongoDB connected")
})



const app = express()
const PORT = process.env.PORT || 8000

app.set('view engine','ejs');
app.set('views',path.resolve('./views'))

app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.resolve('./public')))


app.get('/',async (req,res)=>{
    const allBlogs = await Blog.find({})
    res.render('home',{
        blog: allBlogs
    })
}
)

app.use('/user', userRoutes)
app.use('/feed',checkToken(),async (req,res)=>{
    const allBlogs = await Blog.find({})
    res.render('home',{
        user: req.user,
        blog: allBlogs
    })})
app.use('/blog',checkToken() , blogRoutes)

app.listen(PORT,()=>{
    console.log('Server started at',PORT)
})