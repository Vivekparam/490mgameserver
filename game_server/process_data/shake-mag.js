module.exports = {
  //TODO: make constants
  SHAKE_THRESHOLD_GRAVITY: 2.7, // TODO: figure out what this value should be
  MIN_SHAKE_INTERVAL_MS: 250,

  prevProcessedTimestamp: 0,
  shakeCount: 0,

  parseNum: function(data) {
    var shakeStartThreshold = 29;
    var shakeStopThreshold = 22/29 * shakeStartThreshold;
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
    var inShake =  false;
    var shakeStartTime = null;
    while (data.length > 0) {
      var cur = data.pop(); // suppose every data pop is in a small interval
      var arr = cur.value;
      var curAcceleration = { x: arr[0], y: arr[1], z: arr[2] };
      var mag = Math.sqrt(curAcceleration.x * curAcceleration.x + curAcceleration.y * curAcceleration.y + curAcceleration.z * curAcceleration.z);

      // perform check that it's accelerometer type data sent back from the Backend
      curTime = parseInt(cur.time);
      if (cur.type == "TYPE_ACCELEROMETER" ) {
        console.log(curTime + "\t" + mag)
        if (mag > shakeStartThreshold) {
          // console.log("mag " + mag + " is grater than threshold: " + magThreshold);
          if (!inShake) {
            // console.log("Shake started*************");
            inShake = true;
            numShake++;
            shakeStartTime = curTime;
          } else {
            // console.log("waiting for shake to end");
          } // else we do nothing, wait for shake to end
        } else if (mag <= shakeStopThreshold) { // below threshhold for ending a shake
          // console.log("not a shake / shake ended with mag " + mag)
          if(inShake) {   
            shakeEndTime = curTime;
            shakeDuration = shakeEndTime
            // console.log("shake duration was " + shakeDuration)
          }
          inShake = false;

        }
        prevAcceleration = { x: curAcceleration.x, y: curAcceleration.y, z: curAcceleration.z }

      } 
      prevTime = curTime;
    }
    return numShake; 
  },

  getCount: function() {
    return shakeCount;
  },

  

};

