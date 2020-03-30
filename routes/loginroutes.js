var home = require('./../routes/home');

exports.registration = function (req, res, next) {
    if (req.session.user)
        res.redirect("/homePage");
    var users = {
        "username": req.body.username,
        "email": req.body.email,
        "password": req.body.password,

    };
    connection.query('SELECT username FROM `test2`.`users` WHERE username=?;', users.username, function (error, results, fields) {
        if (results.length > 0) {
            if (users.username === results[0].username)
                console.log("The username already exists");
            //do something to display that here
            res.render('registration');
        }
        else {
            (connection.query('SELECT email FROM `test2`.`users` WHERE email=?;', users.email, function (error, results, fields) {
                if (results.length > 0) {
                    if (users.email === results[0].email)
                        console.log("The email already exists");
                    //do something to display it here
                    res.render('registration');
                } else {
                    connection.query('INSERT INTO users SET ?', users, function (error, results, fields) {
                        if (error) {
                            console.log("error ocurred", error);
                            res.send({
                                "code": 400,
                                "failed": "error ocurred"
                            })
                        } else {
                            exports.login(req, res);
                        }
                    });
                }
            }));
        }
    });
};

exports.login = function (req, res) {
    if (!req.session.user) {
        var username = req.body.username;
        var password = req.body.password;
        connection.query('SELECT password FROM `test2`.`users` WHERE username=?;', [username], function (error, results, fields) {
            if (error) {
                console.log("Error");
            } else {
                if (results.length > 0) {
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].password === password) {
                            connection.query('SELECT id FROM `test2`.`users` WHERE username=?;', [username], function (error, r, fields) {
                                //good credentials
                                console.log("logged in");
                                global["isLoggedIn"] = true;
                                req.session.user = r[0].id;
                                home.list(req, res);
                            });
                        } else {
                            //username != password
                            console.log("username and password do not match");
                            // res.redirect("/login.html")
                            res.render('login');
                        }
                    }
                } else {
                    //user doesn't exist
                    console.log("username does not exist");
                    // res.redirect("/login.html")
                    res.render('login');
                }
            }
        });
    } else home.list(req, res);
};