const mongoose = require('mongoose')
const {generateToken} = require('../services/authentication')
const {createHmac,randomBytes} = require('crypto')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profileImageURL: {
        type: String,
        default: '/images/user_profile'
    },
    role: {
        type: String,
        enum: ['USER','ADMIN'],
        default: 'USER'
    },
    salt: {
        type: String,
    }
},{timestamps: true})

userSchema.pre('save',function(next){
    const user = this

    if(!user.isModified('password')) next()
    
    const salt = randomBytes(16).toString()
    const hashedPass = createHmac('sha256',salt).update(user.password).digest('hex')

    this.salt = salt
    this.password = hashedPass

    next()

})

userSchema.static('matchPasswordAndGenerateToken',async function(email,password){
    const user = await this.findOne({email})
    if(!user) throw new Error('User not found')

    const salt = user.salt
    const hashedPass = user.password

    const providedPass = createHmac('sha256',salt).update(password).digest('hex')

    if(hashedPass !== providedPass) throw new Error('Incorrect password')

    const token = generateToken(user)
    return token
})

const User = mongoose.model('user', userSchema)

module.exports = User

