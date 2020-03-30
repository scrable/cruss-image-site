exports.details = function(req, res){
    var g = req.url;
    global["paths"] = g.substring(13, g.length);
    var t = parseInt(paths);

    connection.query('SELECT * FROM `test2`.`imageposts` WHERE id=?;', t,function(err,rows) {
        connection.query('SELECT * FROM `test2`.`comments` WHERE fk_postid=?;', t, function (err, cms) {
            if (typeof rows == 'object' && !rows.length) {
                res.redirect('/homePage');
            } else {
                res.render('imageDetails', {data: rows, cmnts: cms});
            }
        });
    });

};