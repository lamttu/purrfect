const express = require("express");
const router = express.Router({mergeParams: true});
const Cat = require("../models/cat");
const Comment = require("../models/comment");
const middleware = require("../middlewares");

// -------------- COMMENTS --------------------
// Add new comment
router.post("/", (req, res) =>{
    req.body.text = req.sanitize(req.body.text);
    var comment = {
        author:{
            id: req.user._id,
            username: req.user.username
        },
        text: req.body.text
    }
    Cat.findById(req.params.id, (err, cat) =>{
        if(err || !cat){
            req.flash("Oops! Looks like this cat has run away. Please try again");
            res.redirect("/cats/"+ req.params.id);
        }else{
            Comment.create(comment, (err, createdComment) =>{
                if(err){
                    req.flash("Oops! Something went wrong");
                    res.redirect("/cats/"+ req.params.id);
                }else{
                    cat.comments.push(createdComment);
                    cat.save();
                    res.json({
                        comment: createdComment,
                        cat_id: cat._id
                    });
                }
            })
        }
    })
});
// Edit comment
router.put("/:commentId", middleware.checkCommentAuth, (req, res) =>{
    req.body.comment.text = req.sanitize(req.body.comment.text);
    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, {new: true}, (err, comment)=>{
        if(err || !comment){
            console.log(err);
            req.flash("Oops! Something went wrong with this comment");
            res.redirect("back");
        }else{
            //console.log(comment);
            res.json({
                comment: comment,
                cat_id: req.params.id
            })
        }
    })
   
})
// Delete comment
router.delete("/:commentId", middleware.checkCommentAuth, (req, res) =>{
    //Pull the comment from cat 
    Cat.findByIdAndUpdate(req.params.id, {
        $pull: {
          comments: req.params.commentId
        }
    }, (err) =>{
        if(err){
            req.flash("error", "Oops! Something went wrong with this comment");
            res.redirect("back");
        }else{
            Comment.findByIdAndRemove(req.params.commentId, (err, comment) =>{
                if(err){
                    req.flash("error", "Looks like we can't find this cat...");
                    res.redirect("back");
                }else{
                    res.json(comment);
                }
            })
        }
    })
    
})

module.exports = router;