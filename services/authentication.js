const jwt = require('jsonwebtoken')

const secret = "zaid"

function generateToken(user){
    const payload = {
        _id: user._id,
        name: user.fullName,
        role: user.role
    }

    const token = jwt.sign(payload,secret);
    return token
}

function verifyToken(token){
    const payload = jwt.verify(token,secret)
    
    return payload
}

module.exports = {
    generateToken,
    verifyToken
}