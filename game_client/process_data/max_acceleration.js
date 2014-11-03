function maxAcceleration(response) {
  var data = JSON.parse(response);
  var max = -100000; // some min for the phone acceleration; 
  var div = document.getElementById("resultsTable");
  div.innerHTML = "";
  var table = document.createElement("table");

  while (data.length > 0) {
    var cur = data.pop();
    var arr = cur.value;
   // if (cur.type == "TYPE_ACCELEROMETER") {
    console.log(arr);
      var sum = Math.pow(arr[0], 2) + Math.pow(arr[1], 2) + Math.pow(arr[2], 2);
      var acceler = Math.sqrt(sum);
      if (acceler > max) {
        max = acceler;
      }
      var row =  table.insertRow(-1);
      var cell = row.insertCell(-1);
      // cell.innerHTML += "time: " + cur.time +
      //                   "   acceleromter: " + arr + "<br/>";
   // }
  }
  div.appendChild(table);
  var printMax = document.getElementById("printResult");
  printMax.innerHTML += "<center><h4>Results</h4></center>" +
                       "<br/> Magnitude of max acceleration: " + max;
}


