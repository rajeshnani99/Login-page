const express = require("express");
const mongoose = require("mongoose");
const RegisterUser = require("./model");
const jwt = require("jsonwebtoken");
const middleware = require("./middleware");
const cors = require("cors");

const app = express()
mongoose.connect("mongodb+srv://rajeshnani99:rajeshvelas0546@cluster0.znlrw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(
    () => console.log("db connected")
)


app.use(express.json());
app.use(cors({ origin: "http://localhost:3000/" }))

app.post("/register", async (res, req) => {
    try {
        const { username, email, password, confrimpassword } = req.body;
        let exist = await RegisterUser.findOne({ email })
        if (exist) {
            return res.status(400).send("User is already exist")
        }
        if (password !== confrimpassword) {
            return res.status(400).send("password not matched")
        }
        let newUser = new RegisterUser({
            username,
            email,
            password,
            confrimpassword,
        })
        await newUser.save();
        res.status(200).send("Registered successfully")
    }
    catch (err) {
        console.log(err)
        res.status(500).send("internal server error")
    }
})

app.post("/login", async (res, req) => {
    try {
        const { email, password } = req.body;
        let exist = await RegisterUser.findOne({ email });
        if (!exist) {
            return res.status(400).send("user already exist")
        }
        if (exist.password !== password) {
            return res.status(400).send("wrong password")
        }
        let payload = {
            user: {
                id: exist.id,
            }
        }
        jwt.sign(payload, jwtSecert, { expiresIn: 360000 }, (err, token) => {
            if (err) throw err;
            return res.json({ token })
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).send(" server error")
    }
})


app.get("/myprofile", middleware, async (res, req) => {
    try {
        let exist = await RegisterUser.findById(req.user.id);
        if (!exist) {
            return res.status(400).send("user not found");
        }
        res.json(exist);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("server error")
    }
})

app.listen(5000, () => {
    console.log("server is running")
})