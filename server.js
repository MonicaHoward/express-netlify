const express = require('express');
const bodyParser = require('body-parser');
const serverless = require('serverless-http');
const ejs = require('ejs');
const MongoClient = require('mongodb').MongoClient;

const app = express();

const DB_URI = 'mongodb+srv://monicah2:bobdylan33@db1.zjskuo0.mongodb.net/?retryWrites=true&w=majority';
const DB_NAME = 'marcbBlogDB';


MongoClient.connect(DB_URI, {useUnifiedTopology: true})
    .then(client => {

        console.log(`Connected to Mongo Client`);

        const db = client.db(DB_NAME);
        const blogCollection = db.collection('blogs');

        app.set('view engine', 'ejs');
        app.set('views', './src/views');
        app.use(bodyParser.urlencoded({urlencoded: true}));
        app.use(bodyParser.json());


        app.get("/", (req, res) =>{
            res.render("index");
        })

        app.get("/create-blog", (req, res) => {
            res.render("createBlog")
        })

        app.post("/api/blogs", (req, res) => {
            blogCollection.insertOne(req.body)
            .then(result => {
               res.redirect("/"); 
            })
        })

        app.get("/blogs/:title", (req, res) => {
            let blogTitle = req.params.title;

            blogCollection.findOne({title: blogTitle})
            .then(result => {
                res.render('blog', {result: result})
            })
        })

        app.delete("/delete/blogs/:title", (req, res) => {
            let blogTitle = req.params.title;

            blogCollection.deleteOne({title: blogTitle})
            .then(result => {
                console.log(`Blog with title ${result} was deleted`);
                res.redirect("/");
            })

        })



        const PORT = 3001;
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        })

    })

    app.use(bodyParser.json());
    app.use('/.netlify/functions/server', router);  // path must route to lambda
    
    module.exports = app;
    module.exports.handler = serverless(app);