function parseData(response) {
  var data = JSON.parse(response);
  while (data.length > 0) {
    var cur = data.pop();
    if (cur.type == "accelerometer") {
      document.write( "time: " + cur.time +  
                      "acceleromter: " + cur.value + "<br/>");
    }      
  }
}
// in node
function submitTime(startTime) {
  var endTime = new Date().getTime();

  var url = 'http://128.208.3.106:3000/submit';
  var http = new XMLHttpRequest();
  var params = { 
    startTime: 1,//startTime,
    endTime: 200000000000,//endTime
  };
  http.open("POST", url, true);
    
  //Send the proper header information along with the request
  http.setRequestHeader("Content-type", "application/json");    
  http.onreadystatechange = function() {
    if(http.readyState == 4 && http.status == 200) {
      // alert(http.responseText);
      // suppose this data is already filtered according to the given timestamp
      var response = http.responseText;
      alert(response);
      parseData(response);
      console.log("Got response from submit: " + http.responseText);
    }
  }
  http.send(JSON.stringify(params));
}

function start() {
  var startTime = new Date().getTime();
  var interval = 2; // 30 seconds
  startSensors();
  countdown(5, function() {
    submitTime(startTime); 
    stopSensors();
    showResults();
  }); 
}

function startSensors() {
  //start thems
}

function stopSensors() {
  //stop em
}

function showResults() {

}
