var express = require("express");
var login = require('./routes/loginroutes');
var imageDetails = require('./routes/imagedetails');
var searchResults = require('./routes/searchResults');
var editpost = require('./routes/editpost');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var multer = require('multer');
var multerS3 = require('multer-s3');
var AWS = require('aws-sdk');
var router = express.Router();
global["imgname"] = "";
global["isLoggedIn"] = false;
var app = express();

if(process.env.ENABLE_HTTPS === 'true') {
    var enforce = require('express-sslify');
    app.use(enforce.HTTPS({trustProtoHeader: true}));
}

var s3 = new AWS.S3({
    accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_BUCKET_SECRET_ACCESS_KEY,
    region: 'us-east-1',
});

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: function (req, file, cb) {
            imgname = "public/" + Date.now().toString() + file.originalname;
            cb(null, imgname)
        }
    })
});

mysql = require('mysql');
global["connection"] = mysql.createConnection({
    host: process.env.AWS_HOST,
    user: process.env.AWS_USER,
    password: process.env.AWS_PASSWORD,
    database: process.env.AWS_DATABASE
});
global["connection"].connect(function (err) {
    if (!err) {
        console.log("Database is connected");
    } else {
        console.log("Error connecting database");
    }
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'greetings', saveUninitialized: false, resave: true,
    cookie: {maxAge: 60000000, httpOnly: true, secure: false}
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function (req, res) {
    res.redirect('/homePage');
});

app.get('/login', checkLogin, function (req, res, next) {
    res.render('login', {isLoggedIn: isLoggedIn});
});

app.get('/registration', checkRegistration, function (req, res, next) {
    res.render('registration', {isLoggedIn: isLoggedIn});
});

app.get('/logout', checkLogout, function (req, res) {
    isLoggedIn = false;
    res.render('logout', {isLoggedIn: isLoggedIn});

});

app.get('/postImage', checkSignIn, function (req, res) {
    res.render('postImage', {isLoggedIn: isLoggedIn});
});

app.get('/imageDetails*', imageDetails.details);

app.get('/homePage', function (req, res) {
    if (req.session.user) {
        isLoggedIn = true;
    } else isLoggedIn = false;
    connection.query('SELECT * FROM `test2`.`imageposts`;', function (err, rows) {
        if (err)
            console.log("Error Selecting : %s ", err);
        res.render('homePage', {page_title: "Test Table", data: rows, isLoggedIn: isLoggedIn});
    });
});

function checkLogin(req, res, next) {
    if (!req.session.user) {
        next();
    } else {
        var err = new Error("Already logged in");
        next(err);
    }
}

function checkSignIn(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        var err = new Error("Not logged in");
        next(err);
    }
}

function checkRegistration(req, res, next) {
    if (!req.session.user) {
        next();
    } else {
        var err = new Error("Already registered user");
        next(err);
    }
}

function checkLogout(req, res, next) {
    if (req.session.user) {
        req.session.destroy();
        res.redirect('/homePage');
    } else {
        var err = new Error("Not logged in");
        next(err);
    }
}
app.get('/homePage.html', function(req, res){
    res.redirect('/homePage');
});

app.get('/login.html', function(req, res){
    res.redirect('/login');
});

app.get('/logout.html', function(req, res){
    res.redirect('/logout');
});

app.get('/registration.html', function(req, res){
    res.redirect('/registration');
});

app.get('/postImage.html', function(req, res){
    res.redirect('/postImage');
});


//get some posts
app.post('/login', login.login);

app.post('/registration', login.registration, login.login);

app.post('/postImage', upload.single('img'), function (req, res, next) {
    console.log(req.body.title);
    console.log(imgname);
    var imageInfo = {
        "title": req.body.title,
        "description": req.body.description,
        "fk_userid": req.session.user,
        "active": "1",
        "photopath": imgname,
    };
    connection.query('INSERT INTO imageposts SET ?;', imageInfo, function (error) {
        if (error) {
            console.log("error ocurred", error);
        }
    });
    res.redirect('/homePage');
});
app.post('/homePage', searchResults.list);

app.post('/imageDetails*', editpost.edit);

app.use('/login', function (err, req, res, next) {
    console.log(err);
    //redirect if logged in
    res.redirect('/homePage');
});

app.use('/registration', function (err, req, res, next) {
    console.log(err);
    //redirect if logged in
    res.redirect('/login');
});

app.use('/postImage', function (err, req, res, next) {
    console.log(err);
    //redirect if not logged in
    res.redirect('/login');
});

app.use('/logout', function (err, req, res, next) {
    console.log(err);
    //redirect
    res.redirect('/homePage');
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

app.listen(5000);

module.exports = app;