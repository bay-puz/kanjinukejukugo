function showAnalytics(inputList) {
    showSummarize(inputList)
    showCount(inputList)
    showHint(inputList)
    showUsed(inputList)
}

function showSummarize(inputList) {
    const allKanji = makeAllKanji(inputList)
    const countDict = makecountDict(inputList)

    var nukeKanji = []
    var hintKanji = []
    for (const [kanji, count] of Object.entries(countDict)) {
        if (count == 1) {
            hintKanji.push(kanji)
        }
        else {
            nukeKanji.push(kanji)
        }
    }

    var summarizeElement = document.getElementById("summarized")
    summarizeElement.innerHTML = null

    summarizeElement.innerHTML = "熟語：" + inputList.length + "語／文字：" + allKanji.length + "個"
    summarizeElement.innerHTML += "<br>"
    summarizeElement.innerHTML += "ヒント：" + hintKanji.length + "個／抜け漢字：" + nukeKanji.length + "種"
}

function showCount(inputList) {
    const countDict = makecountDict(inputList)

    var countKanji = {}
    for (const [kanji, count] of Object.entries(countDict)) {
        if (countKanji[count] === undefined) {
            countKanji[count] = []
        }
        countKanji[count].push(viewChar(kanji))
    }

    if (countKanji.length <= 0) {
        return
    }
    var countElement = document.getElementById("count")
    countElement.innerHTML = null
    for (const [count, kanji] of Object.entries(countKanji)) {
        const element = document.createElement("div")
        element.innerText = count + "回：" + kanji.join("、") + "（" + kanji.length + "種）"
        countElement.appendChild(element)
    }
}

function showHint(inputList) {
    const countDict = makecountDict(inputList)

    var hintCount = {}
    for (const jukugo of inputList) {
        var hint = 0
        for (const kanji of jukugo) {
            if (countDict[kanji] === 1) {
                hint += 1
            }
        }
        hintCount[hint] = (hintCount[hint] || 0) + 1
    }

    var hintElement = document.getElementById("hint")
    hintElement.innerHTML = null
    for (const [num, count] of Object.entries(hintCount)) {
        const element = document.createElement("div")
        element.innerText = num + "ヒント：" + count + "語"
        hintElement.appendChild(element)
    }
}

function showUsed(inputList) {
    const countDict = makecountDict(inputList)

    var nukeSet = new Set()
    for (const [kanji, count] of Object.entries(countDict)) {
        if (count > 1) {
            nukeSet.add(kanji)
        }
    }

    var jukugoNuke = []
    for (const jukugo of inputList) {
        var nukeKanji = new Set()
        for (const kanji of jukugo) {
            if (nukeSet.has(kanji)) {
                nukeKanji.add(kanji)
            }
        }
        jukugoNuke.push(nukeKanji)
    }
    var resultList = []
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
    var usedElement = document.getElementById("used")
    usedElement.innerHTML = null
    for (const msg of resultList) {
        const element = document.createElement("div")
        element.innerText = msg
        usedElement.appendChild(element)
    }
}

function sameAlert(j1, j2) {
    return viewJukugo(j1) + "と" + viewJukugo(j2) + "は抜け漢字が同じ"
}

function includedAlert(j1, j2) {
    return viewJukugo(j1) + "の抜け漢字は" + viewJukugo(j2) + "に含まれる"
}

function aloneAlert(k, j) {
    return "「" + viewChar(k) + "」は" + viewJukugo(j) + "でしか使われていない"
}