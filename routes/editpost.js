const imageDetails = require("./imagedetails");
const postcomment = require("./postComment");
exports.edit = function (req, res) {

    // if we are posting a comment, reload imagedetails page
    if (postcomment.postcomment(req, res))
        imageDetails.details(req, res);

    let g = req.url;
    global["paths"] = g.substring(13, g.length);
    let t = parseInt(paths);
    let posttitle;
    let postid;
    let postdescription;

    // run if we are editing
    if (req.body.title && req.body.description) {
        connection.query('SELECT * FROM `test2`.`imageposts` WHERE id=?;', t, function (err, rows) {
            connection.query('SELECT * FROM `test2`.`comments` WHERE fk_postid=?;', t, function () {
                posttitle = req.body.title;
                postdescription = req.body.description;
                postid = rows[0].id;
                var filter1 = [posttitle, postid];
                var filter2 = [postdescription, postid];
                connection.query('UPDATE `test2`.`imageposts` SET title=? WHERE id=?', filter1, function () {
                    connection.query('UPDATE `test2`.`imageposts` SET description=? WHERE id=?', filter2, function (err) {
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
        });
    }
};