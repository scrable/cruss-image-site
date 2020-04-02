const imageDetails = require("./imagedetails");
const postcomment = require("./postComment");
exports.edit = function(req, res){

    // if we are posting a comment, reload imagedetails page
    if (postcomment.postcomment(req, res))
        imageDetails.details(req, res);

    var g = req.url;
    global["paths"] = g.substring(13, g.length);
    var t = parseInt(paths);
    var posttitle;
    var postid;

    // run if the title has changed
    if(req.body.title) {
        connection.query('SELECT * FROM `test2`.`imageposts` WHERE id=?;', t, function (err, rows) {
            connection.query('SELECT * FROM `test2`.`comments` WHERE fk_postid=?;', t, function (err, cms) {
                posttitle = req.body.title;
                postid = rows[0].id;
                var filter1 = [posttitle, postid];
                connection.query('UPDATE `test2`.`imageposts` SET title=? WHERE id=?', filter1, function (err) {
                    if (err) {
                        console.log("Error replacing title : %s ", err);
                    }
                    if (typeof rows == 'object' && !rows.length) {
                        res.redirect('/homePage');
                    } else {
                        imageDetails.details(req, res);
                    }
                });
            });
        });
    }
};