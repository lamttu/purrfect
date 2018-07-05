const express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    flash = require("connect-flash"),
    moment = require("moment"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    LocalStrategy = require("passport-local");
    
// Set up environment
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());

// Set up momentjs
require("moment/min/locales.min");
moment.locale('en');
app.locals.moment = moment;

// Include routes
const catRoutes = require("./routes/cat"),
    commentRoutes = require("./routes/comment"),
    indexRoutes = require("./routes/index");
    
// Include models
const Cat = require("./models/cat"),
    User = require("./models/user"),
    Comment = require("./models/comment");

// Connect to mongodb
mongoose.connect("mongodb://localhost/purrfect");

//Set up authentication with passport
app.use(require("express-session")({
    secret: "Cats deserve all the love in this world",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Assign user, error, success to locals to be available to all pages
app.use((req,res, next) =>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

// -------------ROUTES-------------------
app.use(indexRoutes);
app.use("/cats",catRoutes);
app.use("/cats/:id/comments",commentRoutes);

// Listen to server
app.listen(process.env.PORT, process.env.IP, () =>{
    console.log("Server started!");
})