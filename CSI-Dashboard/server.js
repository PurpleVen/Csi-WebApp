const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
// const mysqlsession = require('express-mysql-session')(session);
const router = express.Router();
const app = express();
const oneDay = 1000 * 60 * 5;

app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
app.set('view engine', 'ejs');

app.use(
    session({
        resave: true,
        saveUnitialized: true,
        secret: "secret",
        cookie: { maxAge: oneDay }
    })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json({}))
app.use(bodyParser.urlencoded({ extended: true }));

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
app.use("/event.html",express.static("event.html"));
app.use("/workshop.html",express.static("workshop.html"));
app.use("/projectscard.html",express.static("projectscard.html"));
app.use("/memberscard.html",express.static("memberscard.html"));
app.use("/about.html",express.static("about.html"));




const connection = mysql.createConnection({
    // host: "65.2.176.143",
    // user: "csi",
    // password: "csi",
    // database: "csiApp"
    // host: "localhost",
    // user: "root",
    // password: "",
    // database: "csiApp"
    host: '15.207.106.198',
    user: "csi",
    password: "csi",
    database: "csiApp"
});

// connect to the database
connection.connect(function(error){
    if (error) throw error
    else console.log("connected to the database successfully!")
});



app.get("/",function(req,res){

    let session = req.session;
    if (session.userid) {
      res.redirect("/dashboard");
    } else {
        res.sendFile(__dirname + "/pages/samples/login.html");
    }
    
    
});

app.post("/",encoder, function(req,res){

    

    var username = req.body.username;
    var password = req.body.password;

    connection.query("select * from profile where id = ? and password = ?",[username,password],function(error,results,fields){
        if (results.length > 0) {

            var session = req.session;
            session.userid = req.body.username;

            res.redirect("/dashboard");
            req.session.isAuth = true;
            console.log(req.session);
            console.log(req.session.id);
        } else {

            res.redirect("/");
        }
        res.end();
    })
})

// when login is success
// app.get("/dashboard",function(req,res){
//     res.sendFile(__dirname +"/dashboard.html")
// })

app.get("/dashboard",function(req,res, next){

    var session = req.session;

    if (session.userid != null) {
        res.sendFile(__dirname + "/index.html");
      } else {
        res.sendFile(__dirname + "/pages/samples/login.html");
      }
})

app.get("/logout",function(req,res, next){

    req.session.destroy();
    res.redirect("/");
   
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

app.get('/event',function(req,res,next){
    res.sendFile(__dirname + "/event.html")
});

app.get('./views/tech.html',function(req,res,next){
    res.sendFile('tech');
});

app.get('./views/publicity.html',function(req,res,next){
    res.sendFile('publicity');
});

app.get('./views/feedback.html',function(req,res,next){
    res.sendFile('feedback');
});

app.get("/confData", function(request, response){
    var session = request.session;
    if (session.userid != null) {
        response.sendFile(__dirname + "/index.html");
      } else {
        response.sendFile(__dirname + "/pages/samples/login.html");
      }

});

app.get("/proposalData", function(request, response){
    var session = request.session;
    if (session.userid != null) {
        response.sendFile(__dirname +'/views/proposal.html');
      } else {
        response.sendFile(__dirname + "/pages/samples/login.html");
      }

});

app.get("/minuteData", function(request, response){
    var session = request.session;
    if (session.userid != null) {
        response.sendFile(__dirname +'/views/minute.html');
      } else {
        response.sendFile(__dirname + "/pages/samples/login.html");
      }

});

app.get("/techData", function(request, response){
    var session = request.session;
    if (session.userid != null) {
        response.sendFile(__dirname +'/views/tech.html');
      } else {
        response.sendFile(__dirname + "/pages/samples/login.html");
      }

});

app.get("/publicityData", function(request, response){
    var session = request.session;
    if (session.userid != null) {
        response.sendFile(__dirname +'/views/publicity.html');
      } else {
        response.sendFile(__dirname + "/pages/samples/login.html");
      }

});

app.get("/feedbackData", function(request, response){
    var session = request.session;
    if (session.userid != null) {
        response.sendFile(__dirname +'/views/feedback.html');
      } else {
        response.sendFile(__dirname + "/pages/samples/login.html");
      }

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

app.get("/feedbackall", function(request, response){

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

app.get("/feedbacksingle", function(request, response){

    var id = request.query.id;
    
//    console.log("test: "+id);
   var query = `SELECT * FROM events WHERE eid = "${id}"`;
    // var query = `UPDATE events 
    // SET M_agenda = "${first_name}",  
    // WHERE eid = "${id}"`;
    
    connection.query(query, function(error, data){

        response.json(data[0]);

    })

});

app.get("/feedbackupdate", function(request, response){

    var id = request.query.id;
    var updated_feedback = request.query.updated_feedback;
    //console.log("test: "+id+"//"+updated_feedback);
    var query = `UPDATE events 
    SET M_agenda = "${updated_feedback}"  
    WHERE eid = "${id}"`;
    
    connection.query(query, function(error, data){
 
        response.json(data);


    });

});

app.get("/hodstatusapprove", function(request, response){

    var id = request.query.id;
    // var status = request.query.status;
//    console.log("test: "+id);
    var query = `UPDATE events 
    SET status = 2  
    WHERE eid = "${id}"`;
    
    connection.query(query, function(error, data){

        response.json(data);

    })

});

app.get("/hodstatusreject", function(request, response){

    var id = request.query.id;
    // var status = request.query.status;
//    console.log("test: "+id);
    var query = `UPDATE events 
    SET status = -1
    WHERE eid = "${id}"`;
    
    connection.query(query, function(error, data){

        response.json(data);

    })

});

app.get("/confirmedall", function(request, response){

    connection.query("SELECT name FROM events where status = 2 ORDER BY eid DESC",function(error,results,fields){
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