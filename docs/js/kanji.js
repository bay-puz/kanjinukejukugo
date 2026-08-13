function inputToList(text) {
    var inputList = []
    for (line of text.split('\n')) {
        if (line.startsWith('#')) {
            continue
        }
        inputList.push(line.trim())
    }

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

function encodeProblem(problemList) {
    var codeList = []
    for (const p of problemList) {
        if (typeof(p) === "number") {
            codeList.push(encodeNumber(p))
        } else {
            codeList.push(encodeChar(p))
        }
    }
    return codeList.join('')
}

function decodeProblem(problemList) {
    var problem = []
    for (let index = 0; index < problemList.length;) {
        const head = problemList.substring(index, index + 1)
        if (head === 'z') {
            const char = problemList.substring(index + 1, index + 2)
            problem.push(decodeNumber(char))
            index += 2
            continue
        }
        var str = problemList.substring(index, index + 4)
        problem.push(decodeChar(str))
        index += 4
    }
    return problem
}

function encodeNumber(num) {
    const converter = "0123456789abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXY"
    return 'z' + converter.charAt(num)
}

function decodeNumber(char) {
    const converter = "0123456789abcdefghijklmnopqrstuvwxyABCDEFGHIJKLMNOPQRSTUVWXY"
    return converter.indexOf(char)
}

function encodeChar(char) {
    return char.codePointAt(0).toString(16).padStart(4, '0')
}

function decodeChar(str) {
    return String.fromCodePoint(Number.parseInt(str, 16))
}

function encodeKanji(kanji) {
    const codePoint = kanji.codePointAt(0)
    return codePoint.toString(16).padStart(2, '0')
}

function decodeKanji(str) {
    const codePoint = Number.parseInt(str, 16)
    return String.fromCodePoint(codePoint)
}

function viewNumber(num) {
    return (num + 1).toString()
}
