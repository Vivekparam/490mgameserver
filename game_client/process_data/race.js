var start_time = 0;
var end_time = 0;



// returns true if the phone is at suzzallo
// Lat:   47.655391
// Long: -122.309391
//function atSuzzallo(gps) {
//    return false;
//}

// returns true if the phone is at the HUB
// Lat:   47.655317
// Long: -122.304938
function atHUB(gps) {
    hubLat = 47.655317;
    hubLong =  -122.304938;
    // TODO sensor data 
    currentLat = 0;
    currentLong = 0;
    return withinTolerance(hubLat, currentLat)
            and withinTolerance(hubLong, currentLong);
}

// starts the phone sensors
function start() {
    // start reading data
    // start_time = curr_time
}

// send force at true to force the sensors to stop
function stop(force) {
    if (force or atHUB(getGPS())) {
	// end_time = curr_time
	// stop reading data
    }
}

// returns the time elapsed betwee start and end
function results() {
    return start_time - end_time;
}

// get current gps location
function getGPS() {
    var gps;
    return gps;
}

// returns true if location is within 
function withinTolerance(location, current) {
    // 0.0003 represents 3 * 11.132 m
    return location - current < 0.0003;
}
