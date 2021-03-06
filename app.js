const express = require("express");
const login = require('./routes/loginroutes');
const imageDetails = require('./routes/imagedetails');
const searchResults = require('./routes/searchResults');
const editpost = require('./routes/editpost');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const multer = require('multer');
const multerS3 = require('multer-s3');
var moment = require('moment');
const AWS = require('aws-sdk');
const router = express.Router();
global["photopath"] = "";
global["isLoggedIn"] = false;
const app = express();

if (process.env.ENABLE_HTTPS === 'true') {
    const enforce = require('express-sslify');
    app.use(enforce.HTTPS({trustProtoHeader: true}));
}

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_BUCKET_SECRET_ACCESS_KEY,
    region: 'us-east-1',
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: function (req, file, cb) {
            photopath = Date.now().toString() + file.originalname;
            var s3photopath = "public/" + photopath;
            cb(null, s3photopath)
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

app.get('/deletePost*', function (req, res) {
    res.redirect('/homePage');
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

app.get('/homePage.html', function (req, res) {
    res.redirect('/homePage');
});

app.get('/login.html', function (req, res) {
    res.redirect('/login');
});

app.get('/logout.html', function (req, res) {
    res.redirect('/logout');
});

app.get('/registration.html', function (req, res) {
    res.redirect('/registration');
});

app.get('/postImage.html', function (req, res) {
    res.redirect('/postImage');
});

//get some posts
app.post('/login', login.login);

app.post('/registration', login.registration, login.login);

app.post('/postImage', upload.single('img'), function (req, res, next) {

    let url = require('url');
    let https = require('https');

    let sizeOf = require('image-size');

    let imgUrl = "https://i.squarestory.net/" + photopath;
    let options = url.parse(imgUrl);

    https.get(options, function (response) {
        let chunks = [];
        response.on('data', function (chunk) {
            chunks.push(chunk);
        }).on('end', function () {
            let buffer = Buffer.concat(chunks);
            let dimensions = sizeOf(buffer);
            console.log(dimensions);

            const imageInfo = {
                "title": req.body.title,
                "description": req.body.description,
                "fk_userid": req.session.user,
                "active": "1",
                "photopath": photopath,
                "photowidth": dimensions.width,
                "photoheight": dimensions.height,
                "posttime": moment().format()
            };

            connection.query('INSERT INTO imageposts SET ?;', imageInfo, function (error) {
                if (error) {
                    console.log("error ocurred", error);
                }
            });
            res.redirect('/homePage');
        });
    });
});
app.post('/homePage', searchResults.list);

app.post('/imageDetails*', editpost.edit);

app.post('/deletePost*', function (req, res) {
    if (req.session.user) {
        console.log("gggg");
        let g = req.url;
        global["paths"] = g.substring(11, g.length);
        let t = parseInt(paths);

        let itemToRemove = "";
        let poster = "";
        let isAdmin = "false";

        const userIDsearch = 'SELECT fk_userid FROM `test2`.`imageposts` WHERE id=?';
        connection.query(userIDsearch, t, function (error, userID) {
            if (error) {
                console.log("can't get the userid")
            } else {
                poster = userID[0].fk_userid;
            }
        });

        let adminSQL = 'SELECT * FROM `test2`.`users` WHERE admin=?';
        let adminValues = 1;
        connection.query(adminSQL, adminValues, function (err, userIDs) {
            if (err) {
                console.log("can't get admins")
            } else if (userIDs.length) {
                for (let id = 0; id < userIDs.length; id++) {
                    if (req.session.user === userIDs[id].id) {
                        isAdmin = "true"
                    }
                }
            } else {
                isAdmin = "false"
            }
        });

        const searchsql = 'SELECT * FROM `test2`.`imageposts` WHERE id=?;';
        connection.query(searchsql, t, function (error, result) {
            if (error) {
                console.log("can't get the post's photopath")
            } else if (req.session.user === poster || isAdmin === "true") {
                itemToRemove = result[0].photopath;
                console.log(itemToRemove);
                let params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Delete: {
                        Objects: [
                            {
                                Key: "public/" + itemToRemove
                            },
                        ],
                    },
                };
                s3.deleteObjects(params, function (err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    else {
                        console.log("deleted item from s3");
                    }
                });
                const sql = 'DELETE FROM `test2`.`imageposts` WHERE id=?';
                connection.query(sql, t, function (error) {
                    if (error) {
                        console.log("error deleting imagepost", error)
                    } else {
                        console.log("removed post from database");
                        res.redirect('/homePage');
                    }
                })
            }
        })
    }
});

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