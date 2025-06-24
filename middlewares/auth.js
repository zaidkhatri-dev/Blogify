const {verifyToken} = require('../services/authentication')
const Blog = require('../models/blog')

function checkToken(){
    return async (req,res,next) => {
        const cookieToken = req.cookies.token
        
        if(!cookieToken) {
            res.send('Cannot view Blogs, first signup or login')
        }

        try{
            
            const payload = verifyToken(cookieToken)
            req.user = payload
            
            return next()
        }catch(err){
            
            return res.render('home')
        }
    }
}

module.exports = checkToken