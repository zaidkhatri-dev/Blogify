const {Router} = require('express');
const User = require('../models/user')
const router = Router();

router.route('/signup')
.get((req,res)=>{
    res.render('signup')
})
.post(async (req,res)=>{
    const {fullName,email,password} = req.body
    await User.create({
        fullName,
        email,
        password
    })
    return res.redirect('/feed') 
})

router.route('/login')
.get((req,res)=>{
    res.render('login');
})
.post(async (req,res)=>{
    const email = req.body.email
    const password = req.body.password
    
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password) 
        return res.cookie('token',token).redirect('/feed')
    } catch (error) {
        res.render('login',{
            err: error.message
        })
    }
})

router.get('/logout',(req,res)=>{
    return res.clearCookie('token').redirect('/')
})

module.exports = router


