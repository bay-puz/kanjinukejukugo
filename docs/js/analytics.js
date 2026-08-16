function showAnalytics(inputList) {
    var allKanji = inputList.join('')
    var countDict = {}
    for (const char of allKanji) {
        countDict[char] = (countDict[char] || 0) + 1
    }

    showCount(inputList)
    showUsed(inputList)
}


function showCount(inputList) {
    var allKanji = inputList.join('')
    var countDict = {}
    for (const char of allKanji) {
        countDict[char] = (countDict[char] || 0) + 1
    }

    var countKanji = {}
    for (const [kanji, count] of Object.entries(countDict)) {
        if ( countKanji[count] === undefined ) {
            countKanji[count] = []
        }
        countKanji[count].push(kanji)
    }

    if (countKanji.length <= 0) {
        return
    }
    var countElement = document.getElementById("countKanji")
    countElement.innerHTML = null
    for (const [count, kanji] of Object.entries(countKanji)) {
        const element = document.createElement("p")
        element.innerText = count + "回：" + kanji.join("、") + "（" + kanji.length + "個）"
        countElement.appendChild(element)
    }
}

function showUsed(inputList) {
    var allKanji = inputList.join('')
    var countDict = {}
    for (const char of allKanji) {
        countDict[char] = (countDict[char] || 0) + 1
    }

    var nukeSet = new Set()
    for (const char of allKanji) {
        if (countDict[char] > 1) {
            nukeSet.add(char)
        }
    }

    var jukugoNuke = []
    for (const line of inputList) {
        var nukeKanji = new Set()
        for (const char of line) {
            if (nukeSet.has(char)) {
                nukeKanji.add(char)
            }
        }
        jukugoNuke.push(nukeKanji)
    }
    var resultList = []
    var includedJukugo = []
    var sameJukugo = []
    for (const [i, nuke1] of jukugoNuke.entries()) {
        if (nuke1.size === 0) {
            continue
        }
        for (const [j, nuke2] of jukugoNuke.entries()) {
            if (i === j) {
                continue
            }
            if (nuke2.size === 0) {
                continue
            }
            if (!nuke1.isSubsetOf(nuke2)) {
                continue
            }

            if (nuke1.size === nuke2.size) {
                if (i < j) {
                    resultList.push(sameAlert(inputList[i], inputList[j]))
                }
            }
            else {
                resultList.push(includedAlert(inputList[i], inputList[j]))
            }
        }
    }

    for (const jukugo of inputList) {
        var usingDict = {}
        for (const kanji of jukugo) {
            usingDict[kanji] = (usingDict[kanji] || 0) + 1
        }
        for (const [kanji, count] of Object.entries(usingDict)) {
            if (count < 2) {
                continue
            }
            if (count === countDict[kanji]){
                resultList.push(aloneAlert(kanji, jukugo))
            }
        }
    }

    if (resultList.length === 0) {
        return
    }
    var usedElement = document.getElementById("usedKanji")
    usedElement.innerHTML = null
    for (const msg of resultList) {
        const element = document.createElement("p")
        element.innerText = msg
        usedElement.appendChild(element)
    }
}

function sameAlert(j1, j2) {
    return j1 + "と" + j2 + "は抜けている漢字が同じ"
}

function includedAlert(j1, j2) {
    return j1 + "の抜けている漢字は" + j2 + "に含まれる"
}

function aloneAlert(k, j) {
    return "「" + k + "」は" + j + "でしか使われていない"
}