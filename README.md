# Purrfect
Purrfect is a full-stack NodeJS application project with RESTful routing.

![alt text](https://i.imgur.com/On9eSPe.jpg)

## Introduction
There are people who own cats and don't have enough time to play or take care of them. On the other hand, there are people who don't necessarily have the resouce to own a cat but adore their feline cuteness. 

This website aims to connect the two groups. People can upload their cats photo or browse through cat photos to find the ones they love.
## Features
### Authentication
   - User can sign up with username and password
   - System checks whether the username already exists
   - User can log in with username and password
### Authorization
   - User can only edit and delete posts/comments of their own
   - User can only add new post/comment after being authenticated
### Manage data with CRUD operation in MongoDB
   - Create, read, update, delete cats/comments in MongoDB
   - Once a cat is deleted all comments associated with the cat is also deleted
### AJAX
   - Ajax is used to enhance user experience in updating and deleting data. 
### User profile
   - Basic user profile that shows all the cats uploaded by the same user
### Flash message as error handling and response to user
   - Use `connect-flash` to have error and success messages according to user activities 
