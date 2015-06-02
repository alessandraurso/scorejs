'use strict'

module.exports = function (Score) {
  Score.build = function (obj) {
    if (obj.parts) return buildScore(Score, obj)
    else return mergeParts(Score, buildParts(Score, obj))
  }
}

function buildScore (Score, obj) {
  var score = {}

  score.parts = buildParts(Score, obj.parts)
  merge(score, obj, 'parts')
  return score
}

function mergeParts (Score, parts) {
  var values = Object.keys(parts).map(function (name) { return parts[name] })
  return Score.merge.apply(null, values)
}

function buildParts (Score, parts) {
  var parsed = {}
  Object.keys(parts).forEach(function (name) {
    var part = parts[name]
    if (typeof part === 'string') {
      parsed[name] = Score(part)
    } else {
      var source = part.score
      var options = merge({}, part, 'score')
      parsed[name] = Score(source, options)
    }
  })
  return parsed
}

function merge (dest, src, skip) {
  for (var n in src) {
    if (n !== skip) {
      dest[n] = src[n]
    }
  }
  return dest
}