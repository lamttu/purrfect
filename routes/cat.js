const express = require("express");
const router = express.Router();
const Cat = require("../models/cat");
const Comment = require("../models/comment");
const middleware = require("../middlewares");

//--------------- CATS ------------------------
// Show all cats
router.get("/", (req, res) =>{
    let perPage = 8;
    let pageQuery = parseInt(req.query.page);
    let pageNumber = pageQuery ? pageQuery : 1;
    Cat.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec((err, cats) =>{
        if(err){
            console.log(err);
        }else{
            Cat.count((err, count)=>{
                res.render("cats/index", {
                    cats: cats,
                    current: pageNumber,
                    pages: Math.ceil(count / perPage)
                });
            })
        }
    })
});

// New cats form
router.get("/new", middleware.isLoggedIn, (req, res) =>{
    res.render("cats/new");
});
// Add a new cat logic
router.post("/", middleware.isLoggedIn, (req, res) =>{
    req.body.cat.description = req.sanitize(req.body.cat.description);
    let newCat = req.body.cat;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    newCat.author = author;
    Cat.create(newCat, (err, cat) => {
        if(err){
            console.log(err);
        }
        req.flash("success", "A new cat has joined the family");
        res.redirect("/cats");
    })
})
// Show cat's details
router.get("/:id", (req, res) =>{
    Cat.findById(req.params.id).populate("comments").exec((err, cat) =>{
        if(err || !cat){
            req.flash("error", "Can't find this cat");
            return res.redirect("back");
        }
        res.render("cats/show", {cat:cat});
    })
})
// Show edit cat form
router.get("/:id/edit", (req, res) => {
    Cat.findById(req.params.id, (err, cat) =>{
        if(err || !cat){
            req.flash("error", "This cat has run away from Purrfect :(")
            return res.redirect("back");
        }
        res.render("cats/edit", {cat: cat});
    })
})
// Cat edit logic
router.put("/:id", (req, res) =>{
    Cat.findByIdAndUpdate(req.params.id, req.body.cat, {new: true}, (err, cat)=>{
        if(err){
            req.flash("error", "Oops, seems like this cat has run away, please try again!")
            res.redirect("back");
        }else{
            res.json(cat);
        }
    })
})
// Delete a cat logic
router.delete("/:id", middleware.checkCatAuth, (req, res) =>{
    // Remove all the comments that belong to a cat first
    Comment.remove({_id:{
        $in: req.cat.comments
    }}, (err) => {
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        }else{
            // Remove the cat after removing the comments
            req.cat.remove((err)=>{
                if(err){
                    req.flash("error", err.message);
                    res.redirect("back");  
                }else{
                    req.flash("error", "The cat has been let go...");
                    res.redirect("/cats");
                }
            })
        }
    })
})

module.exports = router;