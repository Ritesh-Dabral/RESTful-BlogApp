var express = require("express"),
    app = express(),
    body_parser = require("body-parser"),
    mongoose = require("mongoose");

app.use(body_parser.urlencoded({extended:true})); //adding body-parser with express
app.set('view engine', 'ejs');
app.use(express.static("public")); //serve static files such as images, CSS files, and JavaScript files


/*  DATA BASE DETAILS */
//coonecting mongoose
var mongo_need_obj = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology:true,
}
mongoose.connect("mongodb://127.0.0.1:27017/Blog_db",mongo_need_obj, function(err,db_response){
    if(err){
        console.log(err);
    }
    else {
        console.log('connected to Blog_db');
    }
});

//making schema
var blog_schema = new mongoose.Schema({
    title: String,
    image: String, //url
    body: String,
    created: {type: Date, default:Date.now},
});

var Blog = mongoose.model("Blog",blog_schema); //a collection with name 'Blog' or 'blogs' will be made

/* test blog
Blog.create({
    title: "Test blog",
    image: "http://hd.wallpaperswide.com/thumbs/winter_nature_3-t2.jpg",
    body: "Blah blah blah",
    //leave 'created' blank
});
*/

/* R E S T F U L     R O U T E S  */

//root route
app.get("/",(req,res)=>{
    res.redirect("/blogs");
});

//show all blogs -----> INDEX ROUTE
app.get("/blogs",(req,res)=>{
    Blog.find({},function(err,db_response){ //calling DB
        if(err)
            console.log(err);
        else{
            res.render("index",{Blogs:db_response});
        }
    });
});

//go to forms blog  -----> NEW ROUTE
app.get("/blogs/new",(req,res)=>{
    res.render("new");
});

//go to create blog  -----> CREATE ROUTE
app.post("/blogs",(req,res)=>{
    Blog.create(req.body.blog, function(err,db_response){
        if(err)
            console.log(err); 
        else
            res.redirect("/"); //redirect to 'home page'
    });
});


//go to show blog  -----> SHOW ROUTE

app.get("/blogs/:id", (req,res)=>{
    Blog.findById(req.params.id, function(err,db_response){
        if(err)
            res.render("unknown");
        else{
            res.render("show", {blog: db_response});
        }
    });
});

//go to edit blog  -----> EDIT ROUTE

app.get("/blogs/:id/edit",(req,res)=>{
    res.render("edit"); 
});


//listen to this port
app.listen(3000,()=>{
    console.log("S E R V E R    S T A R T E D");
});