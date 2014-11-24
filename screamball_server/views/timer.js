// pass in interval to countdown in seconds and a callback function
function countdown(interval, callback) {
  var countdown = document.getElementById("countdown");
  var secondsLeft = interval;
  countdown.innerHTML = interval;
  var id = setInterval(function () {
    secondsLeft = secondsLeft - 1;
    countdown.innerHTML = secondsLeft;
    if (secondsLeft == 0) {
      clearInterval(id);
      callback();
    }
  }, 1000);

}
