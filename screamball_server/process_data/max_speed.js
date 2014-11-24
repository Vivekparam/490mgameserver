//Excepts array structed like:
// [{value: [dimensional_acceleration, ...], time: time_of_val}, ...]
// integrates these and then calculates the magnitude
function maxSpeed(values) {
  // I know there is a better function but whatever...
  return Math.max.apply(
    null,
    trapezoidSumIntegral(values).map(function (val) {
      return magnitude(val.value);
    })
  );
}

function trapezoidSumIntegral(values) {
  var integral = [];
  var prev;
  for (var i = 0; i < values.length - 1; i++) {
    var val1 = values[i];
    var val2 = values[i + 1];
    var diff = val2.time - val1.time;
    prev = {
      value: val1.value.map(function (_, i) {
        var val = (val1.value[i] + val2.value[i]) * diff/2 + (prev ? prev.value[i] : 0);
        return val;
      }),
      time: val2.time
    };
    integral.push(prev);
  }
  return integral;
}

function magnitude(xyz) {
  return Math.sqrt(xyz.reduce(function(prev, curr) {
    return prev + curr * curr;
  }, 0));
}
