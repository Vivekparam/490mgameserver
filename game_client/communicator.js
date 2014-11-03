document.onready=function() {
  //$("#start").on("click", start);
  $(document).on("finishCountDown", finishCountHandler);

  window.GAME_TYPE_MAX_ACCEL = 0;
  window.GAME_TYPE_SHAKE = 'shake';
  window.GAME_TYPE_MAX_VELOCITY = 'speed';
  window.GAME_TYPE_RACE = 4;
  window.gameType = null;

  window.GAME_SERVER_ENDPOINT = 'http://cse490m1.cs.washington.edu:8080'
}

function start() {
  var userid = getUserId();
  var startTime = new Date().getTime();
    console.log(startTime + " startTime");

  startSensors();
  var e = document.getElementById("game");
  window.gameType = e.options[e.selectedIndex].value;
  console.log("Playing game: " + window.gameType)
  countdown(30, window.GAME_TYPE_MAX_ACCEL);
}

function finishCountHandler(e) {
  var gameType = e.gameType;
  var startTime = e.startTime;
  var session_id = e.session_id;
  if (gameType == window.GAME_TYPE_MAX_ACCEL) {
    gameEnded(startTime, session_id);
  } else if (gameType == window.GAME_TYPE_SHAKE) {
    // 
  } else if (gameType == window.GAME_TYPE_MAX_VELOCITY) {
    //
  } else if (gameType == window.GAME_TYPE_RACE) {
    //
  } else {
    console.log("Unknown game type passed in:" + gameType);
  }
  
  stopSensors();
  showResults();
}

function gameEnded(startTime, session_id) {
  var url = 
}


function getUserId() {
  // get from phone
  return 'cc472b7cc75810ee';
}



function startSensors() {
  //start thems
}

function stopSensors() {
  //stop em
}

function showResults() {

}
