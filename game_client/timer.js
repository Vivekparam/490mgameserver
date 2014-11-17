// pass in interval to countdown in seconds and a callback function
function countdown(interval, game) {
  var countdown = document.getElementById("countdown");
  var secondsLeft = interval;
  startTime = game.startTime;
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
        game: game
      });
    }
  }, 1000);
 
}
