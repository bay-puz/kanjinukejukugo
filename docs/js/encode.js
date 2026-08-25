function encodeList(inputList) {
    const viewList = makeViewList(inputList)
    return viewList.join('-')
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
        codeList.push(jukugoCodes.join('_'))
    }
    return codeList.join('-')
}

function encodeAnswer(answerList) {
    var codeList = []
    for (const char of answerList) {
        if (typeof(char) === "number") {
            codeList.push(encodeNumber(char))
        }
        else {
            codeList.push(encodeKanji(char))
        }
    }
    return codeList.join('-')
}

function decodeList(code) {
    const viewList = code.split("-")
    var inputList = []
    for (const line of viewList) {
        inputList.push(normalizeJukugo(line))
    }
    return inputList
}

function decodeProblem(code) {
    if (code.length === 0) {
        return []
    }
    var problemList = []
    for (const jukugoCode of code.split('-')) {
        var jukugo = []
        for (const charCode of jukugoCode.split('_')) {
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
    if (code.length === 0) {
        return []
    }
    var answerList = []
    for (const charCode of code.split('-')) {
        if (parseInt(charCode) || parseInt(charCode) === 0) {
            answerList.push(decodeNumber(charCode))
        }
        else {
            answerList.push(decodeKanji(charCode))
        }
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