// SCRATCH PAPER!!


/* postrequest -- join game
 * if allowed to join game, while loop and get request to getGameState
 * else try again
*/

window.GAME_SERVER_ENDPOINT = 'http://cse490m1.cs.washington.edu:3000'
window.GAME_START_ENDPOINT = window.GAME_SERVER_ENDPOINT + "/join_game"
window.GAME_DATA_ENDPOINT = window.GAME_SERVER_ENDPOINT + "/get_game_state"

function init() {
  req = new XMLHttpRequest();
  req.open("POST", window.GAME_END_ENDPOINT, true);
  req.setRequestHeader("Content-type", "application/json");

  req.onreadystatechange = function() {
    console.log("Recieved response from " + window.GAME_END_ENDPOINT + ": " + req.responseText);
    // print results
    document.getElementById("printResult").innerHTML = req.responseText;
  }
}

function get_data() {
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
}
