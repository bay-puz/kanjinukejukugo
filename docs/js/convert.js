function makeProblemList(inputList, answerList) {
    const countDict = makecountDict(inputList)

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
        const char = (Number(kanji) >= 0)? Number(kanji): kanji
        if (countDict[char] > 1) {
            answerList.push(char)
        }
    }

    for (const [kanji, count] of Object.entries(countDict)) {
        const char = (Number(kanji) >= 0)? Number(kanji): kanji
        if (count > 1 && !answerList.includes(char)) {
            answerList.push(char)
        }
    }
    return answerList
}

function makeAllKanji(inputList) {
    var allKanji = []
    for (const jukugo of inputList) {
        for (const kanji of jukugo) {
            allKanji.push(kanji)
        }
    }
    return allKanji
}

function makecountDict(inputList) {
    const allKanji = makeAllKanji(inputList)
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