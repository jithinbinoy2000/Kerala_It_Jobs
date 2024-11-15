const bcrypt = require('bcrypt')
const encrypt = async (request,response,next) =>{
    try {
    const password = request.body.userPassword
    const encryptedPassword = await bcrypt.hash(password,10)
    request.body.userPassword = encryptedPassword;
    next()  
    } catch (error) {
        console.log("Error while hashing");
        response.status(500).json({message:'Internal Server Error'})
    }
}
module.exports = encrypt