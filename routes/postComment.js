const date = require('date-and-time');
var moment = require('moment');

exports.postcomment = function (req, res) {
    var g = req.url;
    global["paths"] = g.substring(13, g.length);
    var t = parseInt(paths);

    if (req.session.user && req.body.comment) {
        connection.query('SELECT * FROM `test2`.`users` WHERE id=?;', req.session.user, function (error, result) {
            if (error) {
                console.log("error ocurred", error);
            }
            if (result.length > 0) {

                var commentInfo = {
                    "comment": req.body.comment,
                    "fk_userid": req.session.user,
                    "fk_postid": t,
                    "poster": result[0].username,
                    "posttime": moment().format()
                };

                connection.query('INSERT INTO comments SET ?;', commentInfo, function (error) {
                    if (error) {
                        console.log("error ocurred", error);
                    }
                });
            }
        });
        console.log("comment sent");
        return true;
    }
    return false;
};