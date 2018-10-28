var express = require("express"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    app = express();

mongoose.connect("mongodb://localhost/blog", { useNewUrlParser: true });
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.set("view engine", "ejs");

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test post",
//     image: "https://cps-static.rovicorp.com/3/JPG_500/MI0004/478/MI0004478282.jpg?partner=allrovi.com",
//     body: "This is the test one"
// },function(err, blog){
//     if (err){
//         console.log(err);
//     } else {
//         console.log(blog);
//     }
// });

app.get("/", function(req, res){
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if (err) {
            console.log(err);
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

app.get("/blogs/new", function(req, res){
    res.render("new");
});

app.post("/blogs", function(req, res){
    req.body.blogs.body = req.sanitizer(req.body.blogs.body);
    Blog.create(req.body.blogs, function(err, newBlog){
        if (err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err) {
            console.log(err);
        } else {
            res.render("show", {blogs: foundBlog})
        }
    });
});

app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", {blogs: foundBlog})
        }
    });
});

app.put("/blogs/:id", function(req, res){
    req.body.blogs.body = req.sanitizer(req.body.blogs.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blogs, function(err, updateBlog){
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, req.body.blogs, function(err, updateBlog){
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/");
        }
    });
});

app.listen(process.env.PORT,process.env.IP, function(){
    console.log("BLOG Server is working now!")
});