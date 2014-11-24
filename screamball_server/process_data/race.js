var currentTime;
var raceTimer;
var endTime;

// returns true if the phone is at suzzallo
function atCS(gps) {
    return false;
}

// returns true if the phone is at the HUB
// Lat:   47.655317
// Long: -122.304938
function atHUB(rawData) {
    var location = data.pop().value;
    hubLat = 47.655317;
    hubLong =  -122.304938;
    if (withinTolerance(hubLat, location[0])
            && withinTolerance(hubLong, location[1])) {
      endTime = rawData.timestamp;
      return true;
    }
    return false;
}

function atLocation(gps, destLat, destLong) {
    var gps_lat = gps[0];
    var gps_long = gps[1];
    if (withinTolerance(gps_lat, destLat) && withinTolerance(gps_long, destLong)) {
      endRace();
      return true;
    }
    return false;
}

// TODO: call startRace from somewhere
function startRace(user_id, startTime, dest) {
    currentTime = new Date.getTime()
    raceTimer = setInterval(function() {
    request({
      uri: 'http://cse490m2.cs.washington.edu:8080/api/user_data?end=' + endTime + '&id=' + user_id + '&start=' + currentTime,  
      method: "GET",
      timeout: 10000,
      followRedirect: true,
      maxRedirects: 10
    }, function(error, response, body) {
        if(error) {
            console.log(error);
            res.end("error" + error)
        } else {
            endRace(JSON.parse(body));
            res.write(body);
            
            res.end()
        }

	if (atHUB(JSON.parse(body))) {
	    endRace();
	}
      console.log("Hah Got response: " + body);
    });
  }, 1);
}

function endRace(data) {
    clearInterval(raceTimer);
    var totalTime = new Date.getTime() - currentTime;
  // send an empty config file to stop the sensors
  // TODO: uncomment when we run on the device
  // Sensors.loadConfig(JSON.stringify({}), appName);
}

// get current gps location
/*
function getGPS(data) {
  var latitude = data[0];
  var longitude = data[1];
  // TODO: Return something....
}
*/

// returns the time elapsed between start and end
function results() {
    return start_time - end_time;
}

// returns true if location is within 
function withinTolerance(location, current) {
    // 0.0003 represents 3 * 11.132 m
    return Math.abs(location - current) < 0.0003;
}
