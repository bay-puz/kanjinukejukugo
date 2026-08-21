function makeProblemList(inputList, baseList = []) {
    const countDict = makecountDict(inputList)
    const answerList = makeAnswerList(inputList, baseList)

    var problemList = []
    for (const line of inputList) {
        var jukugo = []
        for (const char of line) {
            if (countDict[char] === 1) {
                jukugo.push(char)
            }
            else {
                const index = answerList.indexOf(char)
                jukugo.push(index)
            }
        }
        problemList.push(jukugo)
    }
    return problemList
}

function makeAnswerList(inputList, baseList = []) {
    const countDict = makecountDict(inputList)

    var answerList = []
    for (const kanji of baseList) {
        if (countDict[kanji] > 1) {
            answerList.push(kanji)
        }
    }

    for (const [kanji, count] of Object.entries(countDict)) {
        if (count > 1 && !answerList.includes(kanji)) {
            answerList.push(kanji)
        }
    }
    return answerList
}

function sortAnswerList(anserwList, order) {
    if (order === "reverse") {
        answerList.reverse()
    }
    else if (order === "random") {
        for (var i = answerList.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1))
            const temp = answerList[i]
            answerList[i] = answerList[j]
            answerList[j] = temp
        }
    }
    return answerList
}

function makecountDict(inputList) {
    const allKanji = inputList.join('')
    var countDict = {}
    for (const char of allKanji) {
        countDict[char] = (countDict[char] || 0) + 1
    }
    return countDict
}

function culcTableLength(problemList) {
    var maxNumber = -1
    for (const jukugo of problemList) {
        for (const char of jukugo) {
            if (typeof(char) === "number") {
                maxNumber = Math.max(maxNumber, char)
            }
        }
    }
    return maxNumber + 1
}