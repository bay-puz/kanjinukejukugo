function encodeList(inputList) {
    var codeList = []
    for (const line of inputList) {
        var lineCodes = []
        for (const char of line) {
            lineCodes.push(encodeKanji(char))
        }
        codeList.push(lineCodes.join('-'))
    }
    return codeList.join('_')
}

function encodeProblem(problemList) {
    var codeList = []
    for (const jukugo of problemList) {
        var jukugoCodes = []
        for (const char of jukugo) {
            if (typeof(char) === "number") {
                jukugoCodes.push(encodeNumber(char))
            } else {
                jukugoCodes.push(encodeKanji(char))
            }
        }
        codeList.push(jukugoCodes.join('-'))
    }
    return codeList.join('_')
}

function encodeAnswer(answerList) {
    var codeList = []
    for (const char of answerList) {
        codeList.push(encodeKanji(char))
    }
    return codeList.join('_')
}

function decodeList(code) {
    var inputList = []
    for (const lineCode of code.split('_')) {
        var line = []
        for (const charCode of lineCode.split('-')) {
            line.push(decodeKanji(charCode))
        }
        inputList.push(line.join(''))
    }
    return inputList
}

function decodeProblem(code) {
    var problemList = []
    for (const jukugoCode of code.split('_')) {
        var jukugo = []
        for (const charCode of jukugoCode.split('-')) {
            if (parseInt(charCode) || parseInt(charCode) === 0) {
                jukugo.push(decodeNumber(charCode))
            } else {
                jukugo.push(decodeKanji(charCode))
            }
        }
        problemList.push(jukugo)
    }
    return problemList
}

function decodeAnswer(code) {
    var answerList = []
    for (const charCode of code.split('_')) {
        answerList.push(decodeKanji(charCode))
    }
    return answerList
}

function encodeNumber(num) {
    return (num + 1).toString()
}

function decodeNumber(code) {
    return parseInt(code) - 1
}

function encodeKanji(kanji) {
    const codePoint = kanji.codePointAt(0)
    const code = encoder(codePoint)
    return code
}

function decodeKanji(code) {
    const codePoint = decoder(code)
    return String.fromCodePoint(codePoint)
}

const converter = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

function encoder(codePoint) {
    if (codePoint < 0 ){
        return ""
    }
    if (codePoint >= converter.length) {
        return encoder(Math.floor(codePoint / converter.length)) + encoder(codePoint % converter.length)
    }
    return converter[codePoint]
}

function decoder(code) {
    let codePoint = 0
    for (const char of code) {
        codePoint = codePoint * converter.length + converter.indexOf(char)
    }
    return codePoint
}

function viewNumber(num) {
    return (num + 1).toString()
}
