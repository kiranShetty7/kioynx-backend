const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    profilePic: String,
},   { timestamps: true })


userSchema.methods.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        next()
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model("User", userSchema)
module.exports = User