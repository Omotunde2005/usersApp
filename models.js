const mongoose = require("mongoose")


const userSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String},
        age: {type: Number}
    }
)
const Users = new mongoose.model("User", userSchema)

module.exports = Users