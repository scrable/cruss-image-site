exports.list = function(req, res){

var naptime = req.body.searchbar;

var sql1 = "SELECT * FROM `test2`.`imageposts` WHERE title=?";
var sql2 = "SELECT * FROM `test2`.`imageposts` WHERE description=?";
    connection.query(sql1, [naptime],function(err,rows){
        if(err)
            console.log("Error Selecting : %s ",err );
        connection.query(sql2, [naptime],function(err,cols){
            if(err)
                console.log("Error Selecting : %s ",err );

            if(rows.length > 0)
                res.render('searchResults',{data:rows});
            else
                res.render('searchResults',{data:cols});

        });
    });
};