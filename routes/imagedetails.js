exports.details = function(req, res){
    var g = req.url;
    global["paths"] = g.substring(13, g.length);
    var t = parseInt(paths);
    var gettingUserID;

    connection.query('SELECT * FROM `test2`.`imageposts` WHERE id=?;', t,function(err,rows) {
        connection.query('SELECT * FROM `test2`.`comments` WHERE fk_postid=?;', t, function (err, cms) {
            connection.query('SELECT * FROM `test2`.`users` WHERE admin=?', 1, function(err, userIDs){
                console.log(userIDs)
                if(typeof rows == 'object' && rows.length){
                    gettingUserID = req.session.user;
                }
                if (typeof rows == 'object' && !rows.length) {
                    res.redirect('/homePage');
                }
                else {
                    res.render('imageDetails', {data: rows, cmnts: cms, user_id: gettingUserID, users: userIDs});
                }
            })
        });
    });

};