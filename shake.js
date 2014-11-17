module.exports = {
  //TODO: make constants
  var SHAKE_THRESHOLD_GRAVITY = 2.7; // TODO: figure out what this value should be
  var MIN_SHAKE_INTERVAL_MS = 250;

  var prevProcessedTimestamp = 0
  var shakeCount = 0;


  function getNumShakes(result) {
    var data = JSON.parse(result);
    var div = document.getElementById("resultsTable");
    div.innerHTML = "";
    var table = document.createElement("table");
    shakeCount = parseShake(data);
    div.appendChild(table);
    var printMax = document.getElementById("printResult");
    printMax.innerHTML += "<center><h4>Results</h4></center>" +
                       "<br/> numShakes: " + getShakeCount();
  }

function parseShake(data) {
  var accThreshold = 1
      timeThreshold = 500;
  var prevAcceleration = { x: null, y: null, z: null };
  var prevTime = null;
  var accelerationChange = { x: null, y: null, z: null };
  var numShake = 0;
  while (data.length > 0) {
    var cur = data.pop(); // suppose every data pop is in a small interval
    var arr = cur.value;
    var curAcceleration = { x: arr[0], y: arr[1], z: arr[2] };
    var mag = Math.sqrt(curAcceleration.x * curAcceleration.x + curAcceleration.y * curAcceleration.y + curAcceleration.z * curAcceleration.z);

    if (cur.type == "TYPE_ACCELEROMETER") {
       
      if (prevAcceleration.x !== null && prevAcceleration.y != null && prevAcceleration.z != null) {
         
        accelerationChange.x = isDifferentSigns(prevAcceleration.x, curAcceleration.x, accThreshold);
        accelerationChange.y = isDifferentSigns(prevAcceleration.y, curAcceleration.y, accThreshold);
        accelerationChange.z = isDifferentSigns(prevAcceleration.z, curAcceleration.z, accThreshold);
      }
      if (accelerationChange.x || accelerationChange.y || accelerationChange.z) {
        // shake detected
        numShake++;
      }  
      prevTime = cur.time;
      prevAcceleration = { x: curAcceleration.x, y: curAcceleration.y, z: curAcceleration.z }

    }
  }
  return numShake; 
}

/** DEPRECATED */
function shake(accelTuple, timestamp) {

  var x = accelTuple[0];
  var y = accelTuple[1];
  var z = accelTuple[2];
  var gravityEarth = 1; //TODO: remove

  var gX = x / gravityEarth;
  var gY = y / gravityEarth;
  var gZ = z / gravityEarth;

  var gForce = Math.sqrt(gX * gX + gY * gY + gZ * gZ);
  if  (gForce > SHAKE_THRESHOLD_GRAVITY) {
    // ignore samplings within 500 ms of each other
    if (timestamp < prevProcessedTimestamp + MIN_SHAKE_INTERVAL_MS) {
      return;
    }

    shakeCount++; // TODO: Possible only increment shakecount if gforce changed direction
    console.log("shakeCount is " + shakeCount);
  }
};

function getShakeCount() {
  return shakeCount;
}

function isDifferentSigns(a, b, threshold) {
  if (a > 0 && b > 0 || a < 0 && b <0 || a == 0 && b == 0 && Math.abs(a - b) < threshold) {
    // not different signs
    return false;

  }
  return true;
}
