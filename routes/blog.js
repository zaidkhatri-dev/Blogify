const {Router} = require('express');
const multer = require('multer')
const path = require('path')

const Blog = require('../models/blog');
const Comment = require('../models/comment')

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('./public/uploads'))
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`
    cb(null,fileName)
  }
})

const upload = multer({ storage: storage })

router.get('/add-blog',(req,res)=>{
    res.render('addBlog',{
        user: req.user
    })
})

router.post('/',upload.single('coverImage'),async (req,res)=>{
    const {title,body} = req.body
    const blog = await Blog.create({
      title,
      body,
      createdBy: req.user._id,
      coverImageURL: `/uploads/${req.file.filename}` 
    })
    
    return res.redirect(`/blog/${blog._id}`)
})

router.get('/:id',async (req,res)=>{
  const blog = await Blog.findById(req.params.id).populate('createdBy')
  const comments = await Comment.find({blogId: req.params.id}).populate('userId')
  
  res.render('blog.ejs',{
    user: req.user,
    blog: blog,
    comments: comments
  })
})

router.post('/comment/:blogId',async (req,res) => {
  console.log('in')
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    userId: req.user._id
  })
  res.redirect(`/blog/${req.params.blogId}`)
})

module.exports = router