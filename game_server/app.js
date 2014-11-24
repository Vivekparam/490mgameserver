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
// var shakeobj = require('./process_data/shake.js');
var shakeobj = require('./process_data/shake-mag.js');
var mimicobj = require('./process_data/mimic.js');

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
            start_time: 18397393849384934342342,
            end_time: null,
            game_type: "shake_game",

        }
    }
*/
var game_instances = {};
var game_instances_id = 0;

app.set('views', __dirname + '/views');

app.engine('html', require('ejs').renderFile);

app.configure(function() {
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
  console.log("Recieved request " + req);
  //var start_time = var date = new Date();
  var user_id = req.body.user_id;
  var game_type = req.body.game_type;
  var user_session_time = req.body.start_time;
  var game_id = getUniqueGameId();

  console.log("start_game body")
  console.log(req.body)

  game_instances[game_id] = {
    "game_type" : game_type,
    start_time: user_session_time,
    end_time: null
  }; // initialize object for this game


  var game = game_instances[game_id];
  game[user_id] = {
        "session_id" : null,
        score : null,
        user_start_time : user_session_time
    }
  // TODO: allow multi players at once
  var arena_location = null;
  if(requiresArena(game_type)){
    arena_location = req.body.gps_location;
  }

  startGame(game_id, game_type, arena_location);
  res.writeHead(200, {"Content-Type": "text/html"});

  var responseJSON = {
    game_id: game_id
  }
  res.write(JSON.stringify(responseJSON));
  console.log("About to sent from start_game. game_instances is ")
  console.log(game_instances)
  res.end();
  //next();
})

app.get('/get_data', function (req, res, next) {
    var res_game_id = req.body.game_id;
    var res_user_id = req.body.user_id;
    var res_session_id = req.body.session_id;
    var users_game = game_instances['speed_game_' + game_id]['user_id_' + user_id];
    if (users_game[session_id] == res_session_id) {

      if (users_game[score] == 'null') {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write('not available yet');
        res.end();
      } else {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write(users_game[score]);
        res.end();
        if (users_game[has_completed] == true) {
          users_game[has_requested_final_score] = true;
        }
      }
    }
})

// Post to submit
app.post('/submit_game_end', function (req, res, next) {
    console.log("req body to submit game end: ")
    console.log(req.body)
    var end_time = req.body.end_time;
    res.writeHead(200, {"Content-Type": "text/html"});
    var user_id = req.body.user_id;
    var game_id = req.body.game_id;
    // var session_id = req.body.session_id;
    var startTime = game_instances[game_id]["start_time"];
    var game_type = game_instances[game_id]["game_type"];
    var dataEndpoint = 'http://cse490m2.cs.washington.edu:8080/api/user_data?end='+ end_time+'&id=' + user_id + '&start=' + startTime // + '&queryFunc=TYPE_ACCELEROMETER'
    console.log(dataEndpoint);
    request({
    // uri: 'http://cse490m2.cs.washington.edu:8080/api/user_data&id=1&start=1&end=200000000000',

      uri: dataEndpoint,
      // uri: 'http://cse490m2.cs.washington.edu:8080/api/user_data/1/' + startTime+ '/'+ endTime,
      method: "GET",
      timeout: 10000,
      followRedirect: true,
      maxRedirects: 10
    }, function(error, response, body) {
        if(error) {
            console.log(error);
            res.end("error" + error)
        } else {
          var processedData;
          if(game_type == "shake") {
            processedData = shakeobj.parseNum(JSON.parse(body));
            res.write("Number of shakes: " + processedData);
          } else if (game_type == "mimic") {
            processedData = mimicobj.parseNum(JSON.parse(body))
          } else {
            res.write("Unknown game type")
          }
          res.end()
        }
      //console.log("Hah Got response: " + body);
    });
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
    game_instances_id += 1;
    return game_instances_id; //TODO(vivek): definitely need to change this lol
}

function requiresArena(game_type) {
    return false;
}

function startGame(game_id, game_type, arena_location) {
    // TODO:
    // Request backend for user_ids of all users within a radius of arena_location.
    // Push notification to those users asking them if they want to join the game, making sure to send them the game_id

}

function getGameData(session_id, processData) {
  var endTime = new Date().getTime();
  var http = new XMLHttpRequest();
  // from sample purpose
  // startTime = 1;
  // endTime = 1413840492295460000;
  console.log(startTime + " startTime");
  console.log(endTime + " endTime");

  var url = 'http://cse490m2.cs.washington.edu:8080/api/user_data?session_id=' + session_id;
  // var url = 'http://cse490m2.cs.washington.edu:8080/api/user_data?id=' + userid + "&start=" + startTime + "&end=" + endTime;
  http.open("GET", url, true);

  http.setRequestHeader("Content-type", "application/json");
  http.onreadystatechange = function() {
    if(http.readyState == 4 && http.status == 200) {
      // suppose this data is already filtered according to the given timestamp
      var response = http.responseText;
      console.log("Got response from submit: " + http.responseText);
      console.log("Got response in submitTime(): " + response);
      var ans = getNumShakes(response);
      processData(response);
      // maxAcceleration(response);
      // then POST to submit page later?
    }
  }

  http.send();
}
