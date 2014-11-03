"use strict"

var express = require('express')
var app = express();

var mongojs = require("mongojs") // This is a mongo database I made the other week.
  , uri = "mongodb://user1:user1pass@ds041140.mongolab.com:41140/mymongodb"  
  , collections = ["example_collection", ] // Here we define the collections in our database
  , db = mongojs.connect(uri, collections);

var request = require("request");

require('./views/communicator.js')
require('./views/timer.js')


var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 /*
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true); 
 */
  next();
}

/**
    example game_instances:
    game_instances: {
        "speed_game_24": {
            "user_id_1" : {
                session_id: "given_by_device",
                score: "null",
                has_completed: false,
                has_requested_score: false,
                user_name: "xXl33t_sh4kerXx"
            }
            "user_id_2" : {
                session_id: "given_by_device",
                score: "null",
                has_completed: false,
                has_requested_score: false,
                user_name: "||shakeZofFury||"
            }
            start_time: 18397393849384934342342,s
            end_time: null,
            game_type: "shake_game",

        }
    }
*/
var game_instances = {}


app.set('views', __dirname + '/views');

app.engine('html', require('ejs').renderFile);

app.configure(function() {
    //app.use(allowCrossDomain);
  app.use(express.bodyParser())
  app.use(allowCrossDomain);

});
    
//app.use(express.bodyParser())

app.get('/', function (req, res) {
  res.render('index.html')
})

app.get('/client', function (req, res) {
  res.render('client.html')
})

app.get('/client_results', function (req, res) {
  res.render('client_results.html')
})

// Start a game.
app.post('/start_game', function (req, res, next) {
  var start_time = var date = new Date();
  // var endTime =  
  var user_id = req.body.user_id;
  var game_type = req.body.game_type;
  var session_id = req.body.session_id;
  var game_id = getUniqueGameId();

  var game = game_instances[game_id] = {
    user_id : {
        "session_id" : session_id,
        score : null
    },
    "game_type" : game_type,
    "start_time" : start_time
  }; // initialize object for this game

  var arena_location = null;
  if(requiresArena(game_type)){
    arena_location = req.body.gps_location;
  }

  startGame(game_id, game_type, arena_location); //
  res.writeHead(200, {"Content-Type": "text/html"});
  res.write(game_id);
  res.end();
  next();
})

// Post to submit
app.post('/submit', function (req, res, next) {
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    res.writeHead(200, {"Content-Type": "text/html"});

    console.log('http://cse490m2.cs.washington.edu:8080/api/user_data/1/' + startTime   + '/' + endTime);
    request({
    //uri: 'http://cse490m2.cs.washington.edu:8080/api/user_data&id=1&start=1&end=200000000000',

      uri: 'http://cse490m2.cs.washington.edu:8080/api/user_data?end=200000000000&id=1&start=1',  
    // uri: 'http://cse490m2.cs.washington.edu:8080/api/user_data/1/' + startTime+ '/' + endTime,
      method: "GET",
      timeout: 10000,
      followRedirect: true,
      maxRedirects: 10
    }, function(error, response, body) {
        if(error) {
            console.log(error);
        } else {
            res.write(body);
        }
      console.log("Hah Got response: " + body);
    });

    res.end("end");
    next();
})

app.get('/db_example', function (req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});

    console.log("in /db_example")
    var time = new Date().getTime()
    console.log("Posting timstamp to database: " + time)


    db.example_collection.insert({
        "timestamp": time,
        "source": "db_example_page"
    }), function(err,doc) {
        if(err) {
            console.log("Error adding timestamp to database");
        }
    }

    console.log("Reading from database")
    db.example_collection.find({}, function (err, records) {
        if(err) {
            console.log("There was an error executing the database query: ");
            console.log(err);
            response.end();
            return;
        }
        var html = '<h1>Timestamps</h1>',
            i = records.length;
            console.log(records)
        while(i--) {
            html += ' <br /><b>Source :</b> ' 
                 + records[i].source
                 + '<br /><b>Posted at: </b>' 
                 + new Date(records[i].timestamp).toString()
                 + '<br />';
        }
        res.write(html);
        res.end();
    })
})
app.listen(3000);


/** lib functions */
function getUniqueGameId() {
    return 5; //TODO(vivek): definitely need to change this lol
}

function requiresArena(game_type) {
    return false;
}

function startGame(game_id, game_type, arena_location) {
    // TODO:
    // Request backend for user_ids of all users within a radius of arena_location.
    // Push notification to those users asking them if they want to join the game, making sure to send them the game_id

}
