const Cat = require("../models/cat");
const Comment = require("../models/comment");
var middlewareObj = {};

// ----------- MIDDLEWARE ---------------------------
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        // Get the original url
        req.session.redirectTo = req.originalUrl;
        req.flash("error", "Please log in to continue");
        res.redirect("/login");
    }
}
middlewareObj.checkCatAuth = function(req, res, next){
    if(req.isAuthenticated()){
        Cat.findById(req.params.id, (err, cat)=>{
            if(err || !cat){
                req.flash("error","Looks like the cat has run away...");
                res.redirect("back");
            }else{
                if(cat.author.id.equals(req.user._id)){
                    req.cat = cat;
                    next();
                }else{
                    req.flash("error", "You don't have permission to do this task");
                    res.redirect("back");
                }
            }
        })
    }else{
        req.session.redirectTo = req.originalUrl;
        req.flash("error", "Please log in to continue");
        res.redirect("/login");
    }
}
middlewareObj.checkCommentAuth = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentId, (err, comment)=>{
            if(err || !comment){
                req.flash("error","Looks like the cat has run away...");
                res.redirect("back");
            }else{
                if(comment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You don't have permission to do this task");
                    res.redirect("back");
                }
            }
        })
    }else{
        req.session.redirectTo = req.originalUrl;
        req.flash("error", "Please log in to continue");
        res.redirect("/login");
    }
}

module.exports = middlewareObj;