module.exports = Timer

function Timer(currentTime) {
    var callbacks = []
    var counter = 0

    return {
        setTimeout: setTimeout
        , now: now
        , advance: advance
    }

    function setTimeout(cb, offset) {
        // console.log("pushing onto callbacks", callbacks)
        callbacks.push([cb, currentTime + offset, counter++])
    }

    function now() {
        return currentTime
    }

    function advance(offset) {
        var newTime = currentTime + offset
        // currentTime += offset

        var firstTime = callbacks.map(function (triplet) {
            return triplet[1]
        }).sort()[0]

        // console.log("oops", newTime, firstTime)

        if (newTime > firstTime) {
            var remainder = newTime - firstTime
            var initialJump = firstTime - currentTime
            advance(initialJump)
            advance(remainder)
            return
        }

        currentTime = newTime

        var toRemove = callbacks.filter(function (triplet) {
            var cb = triplet[0]
            var time = triplet[1]

            if (time <= currentTime) {
                cb()
                return true
            }
        })

        toRemove.forEach(function (triplet) {
            var index = callbacks.map(function (triplet) {
                return triplet[2]
            }).indexOf(triplet[2])

            callbacks.splice(index, 1)
        })
    }
}
