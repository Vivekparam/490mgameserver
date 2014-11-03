// pass in interval to countdown in seconds and a callback function
function countdown(interval, gameType) {
  var countdown = document.getElementById("countdown");
  var startTime = new Date().getTime(); 
  var secondsLeft = interval;
  countdown.innerHTML = interval;
  var id = setInterval(function () {
    secondsLeft = secondsLeft - 1;
    countdown.innerHTML = secondsLeft;
    if (secondsLeft == 0) {
      clearInterval(id);
      //countdown.innerHTML = "";

      $(document).trigger({
        type: "finishCountDown",
        message: "",
        startTime: startTime,
        endTime: new Date().getTime(),
        gameType: gameType
      });
    }
  }, 1000);
 
}
