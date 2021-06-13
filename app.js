//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"));



// Mongoose

mongoose.connect("mongodb://localhost:27017/userDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = new mongoose.model("User", userSchema);


// Routes

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", function (req, res) {

    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
        email: req.body.email,
        password: hash
    });

    newUser.save(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });

});

app.post("/login", function (req, res) {

    User.findOne({
        email: req.body.email
    }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (bcrypt.compareSync(req.body.password, foundUser.password)) {
                    res.render("secrets");
                }
            }
        }
    });
});



// Listen

app.listen(3000, () => {
    console.log("Server started on port 3000");
});