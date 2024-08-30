const express = require("express")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const Users = require("./models")
const connectDB = require("./db")
const validator = require("email-validator")


// Config environment variables
dotenv.config()


const app = express()


// Middleware
app.use(express.json())


const PORT = process.env.PORT || 5000


// Connect MongoDB database
connectDB()


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})


// Home page

app.get("/", async(req, res) => {
    response.json("Welcome to our country's database app")
})



// Add a user

app.post("/add-user", async(req, res) => {
    const {name, email, age} = req.body

    if (!name) {
        return res.status(400).json({message: "Name is required."})
    }

    const userExists = await Users.findOne({name})

    if (userExists) {
        return res.status(400).json({message: "This user already exists."})
    }

    if (name.length < 3) {
        return res.status(400).json({message: "Name must have more than 3 letters."})
    }

    const newUser = new Users({name, email, age})
    await newUser.save()

    return res.status(200).json({
        "message": "User registration successful",
        "user": newUser
    })
    
    
})



// Update a user

app.put("/update-email", async(req, res) => {
    const {name, email} = res.body

    if (!name) {
        return res.status(400).json({message: "Name is required."})
    }

    if (!email) {
        return res.status(400).json({message: "Email is required."})
    }

    const userExists = await Users.findOne({name})

    if (!userExists) {
        return res.status(400).json({message: "This user does not exist."})
    }

    const emailValid = validator.validate(email)

    if (!emailValid) {
        return res.status(400).json({message: "Email is invalid."})
    }

    updatedUser = Users.findOneAndUpdate(userExists, email, {new: true})
    return res.status(200).json({
        "message": "User email successfully updated.",
        "user": updatedUser
    })

})


// Add users

app.post("/add-users", async(req, res) => {
    const newUsers = req.body

    if (!Array.isArray(newUsers)) {
        return res.status(400).json({message: "Expected an array of users."})
    }

    for (let i = 0; i < newUsers.length; i++) {
        const user = newUsers[i]

        if (!user.name) {
            return res.status(400).json({message: "Name is required.", "user": user})
        }

        const user_name = {'name': user.name}
        const userExists = await Users.findOne({user_name})

        if (userExists) {
            return res.status(400).json({message: `User already exists.`, "user": user})
        }
    
        if (user.name.length < 3) {
            return res.status(400).json({message: `Name must have more than 3 letters.`, "user": user})
        }

        if (!user.age > 18 || !user.age < 99) {
            return res.status(400).json({message: "Age should be between 18 and 99.", "user": user})
        }

    const savedUsers = await Users.insertMany(newUsers)
    return res.status(200).json({
        "message": "Users added successfully.",
        "users": savedUsers
    })


    }
})


app.use((req, res) => {
    res.status(404).json({message: "This endpoint does not exist"})
})