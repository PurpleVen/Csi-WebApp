const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/images",express.static("images"));
app.use("/css",express.static("css"));
app.use("/scss",express.static("scss"));
app.use("/pages",express.static("pages"));
app.use("/js",express.static("js"));
app.use("/vendors",express.static("vendors"));
app.use("/fonts",express.static("fonts"));
app.use("/partials",express.static("partials"));
// app.use("/insta.html",express.static("insta.html"));
app.use("/jquery",express.static("jquery"));
app.use("/index.html",express.static("index.html"));
app.use("/projectscard.html",express.static("projectscard.html"));
app.use("/memberscard.html",express.static("memberscard.html"));
app.use("/about.html",express.static("about.html"));

const connection = mysql.createConnection({
    // host: "3.110.215.205",
    // user: "csi",
    // password: "csi",
    // database: "csiApp"
    host: "localhost",
    user: "root",
    password: "",
    database: "csiApp"
});

// connect to the database
connection.connect(function(error){
    if (error) throw error
    else console.log("connected to the database successfully!")
});



app.get("/",function(req,res){
    res.sendFile(__dirname + "/pages/samples/login.html");
});

app.post("/",encoder, function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    connection.query("select * from profile where id = ? and password = ?",[username,password],function(error,results,fields){
        if (results.length > 0) {
            res.redirect("/dashboard");
        } else {
            res.redirect("/error");
        }
        res.end();
    })
})

// when login is success
// app.get("/dashboard",function(req,res){
//     res.sendFile(__dirname +"/dashboard.html")
// })

app.get("/dashboard",function(req,res){
    res.sendFile(__dirname + "/index.html")
})

// if credential
app.get("/error",function(req,res){
    res.sendFile(__dirname + "/error.html")
})

// app.get('./views/proposal.ejs',function(req,res,next){
//     res.render('proposal');
//    });

app.get('./views/proposal.html',function(req,res,next){
    res.sendFile('proposal');
   });

app.get('./views/minute.html',function(req,res,next){
    res.sendFile('minute');
});

app.get('./views/tech.html',function(req,res,next){
    res.sendFile('tech');
});

app.get('./views/publicity.html',function(req,res,next){
    res.sendFile('publicity');
});


app.get("/proposalData", function(request, response){

	response.sendFile(__dirname +'/views/proposal.html', {title : 'CSI Student Chapter : Proposals list'});

});

app.get("/minuteData", function(request, response){

	response.sendFile(__dirname +'/views/minute.html', {title : 'CSI Student Chapter : Minutes list'});

});

app.get("/techData", function(request, response){

	response.sendFile(__dirname +'/views/tech.html', {title : 'CSI Student Chapter : Technical Requirements List'});

});

app.get("/publicityData", function(request, response){

	response.sendFile(__dirname +'/views/publicity.html', {title : 'CSI Student Chapter : Publicity Requirements List'});

});

app.get("/fetchall", function(request, response){

        connection.query("SELECT * FROM events ORDER BY eid DESC",function(error,results,fields){
            if (results.length > 0) {
                    // console.log(results);
                    	response.json({
				data:results
			});
            } else {
                response.redirect("/error");
            }
            response.end();
        })
	
});

app.get("/fetchsingle", function(request, response){

		var id = request.query.id;
       console.log(id);
        var query = `SELECT * FROM events WHERE eid = "${id}"`;
        
		connection.query(query, function(error, data){

			response.json(data[0]);

		})

});

app.get("/minuteall", function(request, response){

    connection.query("SELECT * FROM minute ORDER BY id DESC",function(error,results,fields){
        if (results.length > 0) {
                // console.log(results);
                    response.json({
            data:results
        });
        } else {
            response.redirect("/error");
        }
        response.end();
    })

});

app.get("/minutesingle", function(request, response){

    var id = request.query.id;

    console.log(id);

    var query = `SELECT * FROM minute WHERE id = "${id}"`;
    
    connection.query(query, function(error, data){

        response.json(data[0]);

    })

});

app.get("/techall", function(request, response){

    connection.query("SELECT * FROM technical ORDER BY eid DESC",function(error,results,fields){
        if (results.length > 0) {
                // console.log(results);
                    response.json({
            data:results
        });
        } else {
            response.redirect("/error");
        }
        response.end();
    })

});

app.get("/publicityall", function(request, response){

    connection.query("SELECT * FROM publicity ORDER BY eid DESC",function(error,results,fields){
        if (results.length > 0) {
                // console.log(results);
                    response.json({
            data:results
        });
        } else {
            response.redirect("/error");
        }
        response.end();
    })

});

// set app port 
app.listen(4000);