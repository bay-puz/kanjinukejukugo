function inputToList(text) {
    var inputList = []
    for (line of text.split('\n')) {
        if (line.startsWith('#')) {
            continue
        }
        inputList.push(line.trim())
    }
    return inputList
}

function ListToProblem(inputList) {
    const allKanji = inputList.join('')

    var countKanji = {}
    for (const char of allKanji) {
        countKanji[char] = (countKanji[char] || 0) + 1
    }

    var answerList = []
    for (const char of allKanji) {
        if (countKanji[char] > 1 && !answerList.includes(char)) {
            answerList.push(char)
        }
    }

    var problemList = []
    for (const line of inputList) {
        var jukugo = []
        for (const char of line) {
            if (countKanji[char] === 1) {
                jukugo.push(char)
            }
            else {
                const index = answerList.indexOf(char)
                jukugo.push(index)
            }
        }
        problemList.push(jukugo)
    }

    return [problemList, answerList]
}

function problemToInput(problemList, answerList) {
    return problemList.join('\n')
}

function getTableLength(problemList) {
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
