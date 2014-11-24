module.exports = {
  //TODO: make constants
  SHAKE_THRESHOLD_GRAVITY: 2.7, // TODO: figure out what this value should be
  MIN_SHAKE_INTERVAL_MS: 250,

  prevProcessedTimestamp: 0,
  shakeCount: 0,

  parseNum: function(data) {
    var magThreshold = 10;
    var signalDirThreshold = 5;
    var prevAcceleration = { x: null, y: null, z: null };
    var prevTime = 0;
    var curTime = 0;
    var accelerationChange = { x: null, y: null, z: null };
    var numShake = 0;

    var checkThrehold = function(mag, threshold) {
      return (mag > threshold);
    }
    var isDifferentSigns = function(a, b, threshold) {
      console.log(Math.abs(a-b));
      if ((a > 0 && b > 0) || (a < 0 && b <0) || (a == 0 && b == 0) || Math.abs(a - b) < threshold) {
        // not different signs
        // small threshold
          return false;
      }
      return true;
    };

    while (data.length > 0) {
      var cur = data.pop(); // suppose every data pop is in a small interval
      var arr = cur.value;
      var curAcceleration = { x: arr[0], y: arr[1], z: arr[2] };
      var mag = Math.sqrt(curAcceleration.x * curAcceleration.x + curAcceleration.y * curAcceleration.y + curAcceleration.z * curAcceleration.z);

      // perform check that it's accelerometer type data sent back from the Backend
      curTime = parseInt(cur.time);
      if (cur.type == "TYPE_ACCELEROMETER" ) {
        console.log("IN_SHAKE*********************************************");
        console.log("" + curTime); 
        if (prevAcceleration.x !== null && prevAcceleration.y != null && prevAcceleration.z != null) {
          accelerationChange.x = isDifferentSigns(prevAcceleration.x, curAcceleration.x, signalDirThreshold);
          accelerationChange.y = isDifferentSigns(prevAcceleration.y, curAcceleration.y, signalDirThreshold);
          accelerationChange.z = isDifferentSigns(prevAcceleration.z, curAcceleration.z, signalDirThreshold);
        }
        var num = 0;
        if (accelerationChange.x) {
          num += 1;
        } 
        if (accelerationChange.y) {
          num += 1;
        }
        if (accelerationChange.z) {
          num += 1;
        }
        if ((num > 0) && checkThrehold(mag, magThreshold)) {
          // shake detected
          console.log(curTime + " " + accelerationChange.x + " " + accelerationChange.y + " " + accelerationChange.z);
          numShake++;
        }  
        prevAcceleration = { x: curAcceleration.x, y: curAcceleration.y, z: curAcceleration.z }

      } 
      prevTime = curTime;
    }
    return numShake; 
  },

  getCount: function() {
    return shakeCount;
  }

};

