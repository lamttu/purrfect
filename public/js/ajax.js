// Ajax logic for edit cat
$(".cat-info").on("submit", ".edit-form", function(e){
    e.preventDefault();
    let formData = $(this).serialize();
    let formAction = $(this).attr("action");
    $originalItem = $(this).parent(".card-body").parent(".card");
    $.ajax({
        url: formAction,
        type: "PUT",
        data: formData,
        originalItem: $originalItem,
        success: function(cat){
            this.originalItem.html(
                `<img src="${cat.image}" class="img-fluid">
                <div class="card-body">
                    <div class = "info mb-4">
                        <h4 class = "card-title"> <a href ="" >${ cat.name }</a> </h4>
                        <p class="card-text">${ cat.description }<br> <em>Submitted by ${cat.author.username}</em></p>
                    </div>
                    
                    <!--Edit form-->
                    <form class="collapse form-signin edit-form mb-4" id="cat-collapse${cat._id}" action="/cats/${cat._id }" action="/cats/${ cat._id }" method="POST">
                        <div class = "form-group">
                            <input type = "text" class="form-control" name = "cat[name]" value="${ cat.name }">
                        </div>
                        <div class = "form-group">
                            <input type = "number" class="form-control" name = "cat[age]" value="${ cat.age }">
                        </div>
                        <div class = "form-group">
                            <input type = "text" class="form-control" name = "cat[image]" value="${ cat.image }">
                        </div>
                        <div class = "form-group">
                            <textarea name="cat[description]" class="form-control">${ cat.description }</textarea>
                        </div>
                        <input type="submit" class="btn btn-primary" value="Save">
                    </form>
                    <!--End Edit form-->
                    
                    <button class="btn btn-outline-info" data-toggle="collapse" data-target="#cat-collapse${cat._id}">Edit</button>
                    <form class="inline-form" method="POST" method="/cats/${ cat._id}">
                        <button class="btn btn-outline-danger">Delete</button>    
                    </form>
                </div>
                `
                )
        }
    });
});
// Ajax logic for adding comment
$(".add-comment-form").submit(function(e){
    e.preventDefault();
    let formAction = $(this).attr("action");
    let formData = $(this).serialize();
    $.post(formAction, formData, function(data){
        $("#comment-info").append(
            `<div class="row comment">
                <div class= "col-md-12 ">
                    <div class="card bg-light">
                        <div class = "card-body">
                            <div class="float-left">
                              <p class="card-title"> <strong>${data.comment.author.username }</strong> </p>
                            </div>
                            <div class="float-right">A few seconds ago</div>
                            <p class="card-text"> ${ data.comment.text } </p>
                            <form class="collapse edit-comment-form mb-2" id="comment-collapse${data.comment._id}" action="/cats/${data.cat_id}/comments/${data.comment._id}" method="POST">
                                <div class="form-group">
                                    <textarea class="form-control" name="comment[text]">${data.comment.text}</textarea>
                                </div>
                                <input type="submit" class="btn btn-primary" value="Save">
                            </form>
                                
                            <button class="btn btn-warning btn-sm" data-toggle="collapse" aria-expanded="false" data-target="#comment-collapse${data.comment._id}">Edit</button>
                            <form method = "POST" class="inline-form delete-comment-form" action="/cats/${data.cat_id}/comments/${data.comment._id}">
                                <button class = "btn btn-danger btn-sm">Delete</button>
                            </form>
                                
                        </div>
                    </div>
                        
                </div>
            </div> `
        )
        $(".add-comment-form").find(".form-control").val("");
    });
    
});
// Edit comment
$("#comment-info").on("submit", ".edit-comment-form", function(e){
    e.preventDefault();
    let formAction = $(this).attr("action");
    let formData = $(this).serialize();
    $originalItem = $(this).closest(".card");
    $.ajax({
        url: formAction,
        data: formData,
        type: "PUT",
        originalItem: $originalItem,
        success: function(data){
            this.originalItem.html(`
                <div class = "card-body">
                    <div class="float-left">
                      <p class="card-title"> <strong>${data.comment.author.username}</strong> </p>
                    </div>
                    <div class="float-right">${data.comment.created}</div>
                    <p class="card-text"> ${data.comment.text} </p>
                    <!--Edit form-->
                    <form class="collapse edit-comment-form mb-2" id="comment-collapse${data.comment._id}" action="/cats/${data.cat_id}/comments/${data.comment._id}" method="POST">
                        <div class = "form-group">
                            <textarea class="form-control" name="comment[text]">${data.comment.text}</textarea>
                        </div>
                        <button class="btn btn-primary">Save</button>
                    </form>
                    <!--End Edit form-->
                    
                    <button class="btn btn-warning btn-sm" data-toggle="collapse" aria-expanded="false" data-target="#comment-collapse${data.comment._id}">Edit</button>
                    <form method = "POST" class="inline-form delete-comment-form" action="/cats/${data.cat_id}/comments/${data.comment._id}">
                        <button class = "btn btn-danger btn-sm">Delete</button>
                    </form>
               
                    </div>
                </div>
            `)
        }
    });
});
// Delete comment
$("#comment-info").on("submit", ".delete-comment-form", function(e){
    e.preventDefault();
    let confirmationResponse = confirm("Are you sure you want to delete this comment?");
    if(confirmationResponse){
        let formAction = $(this).attr("action");
        $deleteComment = $(this).closest(".comment");
        $.ajax({
            url: formAction,
            type: "DELETE",
            deleteComment: $deleteComment,
            success: function(data){
                this.deleteComment.remove();
            }
        });
    }
    
})