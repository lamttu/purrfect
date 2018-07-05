const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Cat = require("../models/cat");
const passport = require("passport");
// --------------- ROUTE ----------------------
// Landing page
router.get("/", (req, res) =>{
    res.render("landing");
})



// -------------- USERS -----------------------
// Show register form
router.get("/register", (req, res) =>{
    res.render("users/new");
})
// Register logic
router.post("/register", (req,res)=>{
    req.body = req.sanitize(req.body);
    let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        avatar: req.body.avatar
    });
    User.register(newUser, req.body.password, (err, user) =>{
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, ()=>{
            req.flash("success", "Welcome to Purrfect, "+ user.username + "! Have fun browsing our companions");
            res.redirect("/cats");
        })
    })
})
// Show login form
router.get("/login", (req, res) =>{
    res.render("users/login");
})
// Login logic
router.post("/login", (req, res, next) =>{
    passport.authenticate("local", (err, user, info) =>{
        if(err) return next(err);
        if(!user){
            req.flash("error", "Password or username invalid!");
            return res.redirect("/login");
        }
        req.logIn(user, (err) =>{
            if(err) return next(err);
            let redirectTo = req.session.redirectTo ? req.session.redirectTo : "/cats";
            delete req.session.redirectTo;
            res.redirect(redirectTo);
        });
    })(req, res, next);
})
//Logout
router.get("/logout", (req,res)=>{
    req.logout();
    req.flash("success", "Log out successfully");
    res.redirect("/cats");
})
// User profile
router.get("/users/:id", (req, res) =>{
    User.findById(req.params.id, (err, user) =>{
        if(err){
            req.flash("error", "Can't seem to find this user...");
            res.redirect("back");
        }else{
            Cat.find().where("author.id").equals(user._id).exec((err, cats) =>{
                if(err){
                    console.log(err);
                }
                res.render("users/show", {user: user, cats:cats});
            })
            
        }
    })
})
module.exports = router;
