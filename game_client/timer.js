function countdown(sec, callback) {
  var countdown = document.getElementById("countdown");
  var secondsLeft = sec;
  var id;
  id = setInterval(function () {
    secondsLeft = secondsLeft - 1;
    countdown.innerHTML = secondsLeft;
    if (secondsLeft == 0) {
      clearInterval(id);
      callback();
    }
  }, 1000);

}
