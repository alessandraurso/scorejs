var score = require('./score')

/**
* Get all notes for side-effects
*
* __Important:__ ascending time ordered is not guaranteed
*
* @param {Function} fn - the function
* @param {Score} score - the score object
* @param {Object} ctx - (Optional) a context object passed to the function
*/
function forEachTime (fn, obj, ctx) {
  if (arguments.length > 1) return forEachTime(fn)(obj, ctx)
  return function (obj, ctx) {
    return score.transform(
      function (note) {
        return function (time, ctx) {
          fn(time, note, ctx)
          return note.duration
        }
      },
      function (seq) {
        return function (time, ctx) {
          return seq.reduce(function (dur, fn) {
            return dur + fn(time + dur, ctx)
          }, 0)
        }
      },
      function (par) {
        return function (time, ctx) {
          return par.reduce(function (max, fn) {
            return Math.max(max, fn(time, ctx))
          }, 0)
        }
      }
    )(obj)(0, ctx)
  }
}

/**
 * Get a sorted events array from a score
 *
 */
function events (obj, build, compare) {
  var e = []
  forEachTime(function (time, obj) {
    e.push(build ? build(time, obj) : [time, obj])
  }, obj)
  return e.sort(compare || function (a, b) { return a[0] - b[0] })
}

module.exports = { forEachTime: forEachTime, events: events }