// SCRATCH PAPER!!


/* postrequest -- join game
 * if allowed to join game, while loop and get request to getGameState
 * else try again
*/

var GAME_SERVER_ENDPOINT = 'http://cse490m1.cs.washington.edu:3000'
var GAME_START_ENDPOINT = GAME_SERVER_ENDPOINT + "/join_game"
var GAME_DATA_ENDPOINT = GAME_SERVER_ENDPOINT + "/get_game_state"

function init() {
  req = new XMLHttpRequest();
  req.open("POST", GAME_END_ENDPOINT, true);
  req.setRequestHeader("Content-type", "application/json");

  req.onreadystatechange = function() {
    if (req.readyState == 4 && req.status == 200) {

      join_game = JSON.parse(req.responseText).join_game 
      if (join_game) {
        console.log("Joined the game!!! YAY.");
        // TODO: join game
      } else {
        console.log("Sorry, can't join the game right now.");
      }
/*
      console.log("Recieved response from " + window.GAME_END_ENDPOINT + ": " + req.responseText);
      // print results
      document.getElementById("printResult").innerHTML = req.responseText;
*/


    }
  }
}

function get_data() {
    request({
    // uri: 'http://cse490m2.cs.washington.edu:8080/api/user_data&id=1&start=1&end=200000000000',

      uri: GAME_DATA_ENDPOINT,  
      method: "GET",
      timeout: 10000,
      followRedirect: true,
      maxRedirects: 10
    }, function(error, response, body) {
        if(error) {
            console.log(error);
            res.end("error" + error)
        } else {
          // TODO: Draw the ball

          // var data = JSON.parse(body)
          res.end()
        }
      console.log("Hah Got response: " + body);
    });
}
