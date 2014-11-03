function start() {
  var startTime = new Date().getTime();
  var interval = 2; // 30 seconds
  startSensors();
  function callback() {
    var endTime = new Date().getTime();

    var url = 'http://128.208.3.106:3000/submit';
    var http = new XMLHttpRequest();
    var params = {
        startTime: startTime,
        endTime: endTime
    };

    http.open("POST", url, true);
    // start visual timer

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/json");
    // http.setRequestHeader("Content-length", params.length);
    // http.setRequestHeader("Connection", "close");

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            // alert(http.responseText);
            console.log("Got response from submit: " + http.responseText);

        }
    }
    http.send(JSON.stringify(params));
    stopSensors();
    // window.location = 'http://128.208.3.106:3000/client_results'
  }
	countdown(30, callback);
  
}

function startSensors() {
  //start thems
}

function stopSensors() {
  //stop em
}