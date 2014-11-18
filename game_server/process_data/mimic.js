module.exports = {

  // TODO: remove this when support for two players works
  // hard coded data for player one
  HARD_CODED_DATA_HACK: [[0,0,0]],
  TOLLERANCE: 3,

  parseNum: function(data) {
    if (data.length > 0) {
      accelerometerData = data.map(function (item) { item.value });
      return similaityScore(HARD_CODED_DATA_HACK, accelerometerData);
    }

    return 0;
  },

  // returns a similarity score given two sets of 3 dimensional signals
  similarityScore: function (a, b) {

    // convert all to magnitudes
    a = convertToMag(a);
    b = convertToMag(b);

    // allign to first local max
    aFirstMax = firstMax(a);
    bFirstMax = firstMax(b);

    if (aFirstMax < bFirstMax) {
      b = b.slice(bFirstMax - aFirstMax, b.length);
    }

    if (aFirstMax > bFirstMax) {
      a = a.slice(aFirstMax - aFirstMax, a.length);
    }

    // trim back to match the length
    if (a.length < b.length) {
      b = b.slice(0, a.length);
    }

    if (a.length > b.length) {
      a = a.slice(0, b.length);
    }

    return cosineSimilarity(a, b);
  },

  // returns the index of the first local max that exceeds TOLLERANCE
  firstMax: function (a) {

    // find first max
    ai = 1;
    for (ai = 1; ai < a.length; ai++) {
      if (a[ai] + TOLLERANCE < a[ai-1]) {
        return ai;
      }
    }

    return -1;
  },

  // given an array of vectors, returns an array of the magnitudes of each vector.
  // result a[i] = input |a[i]|
  convertToMag: function (a) {
    return a.map(function (vec) { return magnitude(vec); });
  },

  //returns the cosine similarity
  cosineSimilarity: function (a, b) {
    return dotProduct(a, b) / (magnitude(a) * magnitude(b));
  },

  // returns the magnitude of the given vector
  magnitude: function (vec) {
    mag = 0;

    for(i = 0; i < vec.length; i++) {
      mag += vec[i] * vec[i];
    }
    return Math.sqrt(mag);
  },

  // returns the dot product of the two vectors
  dotProduct: function (a, b) {
    dotProd = 0;

    for (i = 0; i < a.length; i++) {
      dotProd += a[i] * b[i];
    }
    return dotProd;
  }
};
