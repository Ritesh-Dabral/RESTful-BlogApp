var express = require("express"),
    app = express(),
    body_parser = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose");

app.use(body_parser.urlencoded({extended:true})); //adding body-parser with express
/*
    sanitizer checks for client input for any embedded JS code which might affect our DB
*/
app.use(expressSanitizer()); // always goes after  body-parser
app.set('view engine', 'ejs');
app.use(express.static("public")); //serve static files such as images, CSS files, and JavaScript files
/* 
    // this package is used to treat 'PUT' 'Delete' and 'Patch' route as they
    // are not supported by 'forms' in html
*/
app.use(methodOverride("_method"));
                            
const PORT = process.env.PORT || 3000;
const URI = "mongodb+srv://riteshD:riteshD@123@cluster0.efubm.azure.mongodb.net/myDBS?retryWrites=true&w=majority";

/*  DATA BASE DETAILS */
//coonecting mongoose
var mongo_need_obj = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology:true,
}
mongoose.connect(URI,mongo_need_obj, function(err,db_response){
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
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err,db_response){
        if(err)
            console.log(err); 
        else
            res.redirect("/"); //redirect to 'home page'
    });
});


//go to show blog  -----> SHOW ROUTE

app.get("/blogs/:id", (req,res)=>{
    //can't get :id easily so use 'req.params.id' to get id from URL
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
    //can't get :id easily so use 'req.params.id' to get id from URL
    Blog.findById(req.params.id, function(err,db_response){
        if(err)
            res.render("unknown");
        else{
            res.render("edit", {blog: db_response});
        }
    });
});

//go to update blog  -----> UPDATE ROUTE
app.put("/blogs/:id", (req,res)=>{
    _id = req.params.id; // id of object to be updated
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(_id, req.body.blog , function(err,db_updated_res){
        if(err)
            res.redirect("/blogs"); //go to index page
        else{
            res.redirect("/blogs/" + _id); // go to show page
        }
    });
});

//go to update blog -----> DELETE ROUTE
app.delete("/blogs/:id", (req,res)=>{
    _id = req.params.id;
    Blog.findByIdAndDelete(_id, function(err,db_deleted_res){
        if(err)
            res.redirect("/blogs/" + _id);
        else{
            res.redirect("/blogs");
        }
    });
});

//listen to this port
app.listen(PORT,()=>{
    console.log("S E R V E R    S T A R T E D");
});