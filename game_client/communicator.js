document.onready=function() {
  //$("#start").on("click", start);
  $(document).on("finishCountDown", finishCountHandler);

  window.GAME_TYPES = ["shake", "maxAccel", "race", "mimic"];
  window.game_type = null;

  window.GAME_SERVER_ENDPOINT = 'http://cse490m1.cs.washington.edu:3000'
  window.GAME_START_ENDPOINT = window.GAME_SERVER_ENDPOINT + "/start_game"
  window.GAME_END_ENDPOINT = window.GAME_SERVER_ENDPOINT + "/submit_game_end"
}

function start() {
  var startTime = new Date().getTime();
  console.log(startTime + " startTime");
  userId = getUserId()
  startTime = Sensors.getTime();
  startSensors();

  var e = document.getElementById("game");
  window.game_type = window.GAME_TYPES[parseInt(e.options[e.selectedIndex].value)]; // games are indexed
  console.log("Starting game: " + window.game_type);


  if(startTime != null) {
    data = {
      user_id :  userId,
      game_type : game_type,
      start_time : startTime
    }
    req = new XMLHttpRequest();
    req.open("POST", window.GAME_START_ENDPOINT, false);
    req.setRequestHeader("Content-type", "application/json");
    req.onreadystatechange = function() {
      console.log("Recieved response from " + window.GAME_START_ENDPOINT + ": " + req.responseText);
      game_id = JSON.parse(req.responseText).game_id;

      var game = { 
          game_type : game_type,
          startTime : startTime,
          game_id : game_id
      }
      countdown(3, game);
    }
    req.send(JSON.stringify(data));
  }
}

// Called whenever finishCountDown event is fired
// the parameter e should have a game_type and startTime attributes
function finishCountHandler(e) {
  var game = e.game;
  if (game_type == window.GAME_TYPES[0]) {
    shakeGameEnded(game);
  } else if (game_type == window.GAME_TYPES[1]) {
    maxAccelEnded(game); 
  } else if (game_type == window.GAME_TYPES[2]) {
    // TODO: race Game Ended
  } else {
    console.log("Unknown game type passed in:" + game_type);
  }
  stopSensors();
  showResults();
}

function shakeGameEnded(game) {
  // tell server game ended
  stopSensors();

  console.log(game)
  data = {
    game_id : game.game_id,
    user_id : getUserId(),
    end_time : Sensors.getTime()
  }
  req = new XMLHttpRequest();
  req.open("POST", window.GAME_END_ENDPOINT, false);
  req.setRequestHeader("Content-type", "application/json");

  req.onreadystatechange = function() {
    console.log("Recieved response from " + window.GAME_END_ENDPOINT + ": " + req.responseText);
    // print results
    document.getElementById("printResult").innerHTML = req.responseText;
  }
  console.log(JSON.stringify(data))
  req.send(JSON.stringify(data));
  // request results from endpoint TODO
  // display results from server
}

function raceGameEnded(game) {
    stopSensors();
}


function getUserId() {
  // get from phone
  return Sensors.getDeviceID();
}

function startSensors() {
  //start thems
  config = { 
  "timeout": 10000, 
  "sensors": [
      { 
        "name": "TYPE_ACCELEROMETER", 
        "rate": 10
      }
    ]
  }
  Sensors.loadConfig(JSON.stringify(config), "derp");
}

function stopSensors() {
  config = { 
    "timeout": 30000, 
    "sensors": []
  }
  Sensors.loadConfig(JSON.stringify(config), "derp");
}

function showResults() {

}

function refreshPage() {
  location.reload();
}
