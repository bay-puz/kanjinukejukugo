function showAnalytics(inputList) {
    var allKanji = inputList.join('')
    var countDict = {}
    for (const char of allKanji) {
        countDict[char] = (countDict[char] || 0) + 1
    }

    showCount(analizeCount(allKanji, countDict))
    showIncluded(analizeIncluded(allKanji, countDict, inputList))
}

function analizeCount(allKanji, countDict) {
    var countKanji = {}
    for (const [kanji, count] of Object.entries(countDict)) {
        if ( countKanji[count] === undefined ) {
            countKanji[count] = []
        }
        countKanji[count].push(kanji)
    }
    return countKanji
}

function showCount(countKanji) {
    if (countKanji.length <= 0) {
        return
    }
    var countElement = document.getElementById("countKanji")
    countElement.innerHTML = null
    for (const [kanji, count] of Object.entries(countKanji)) {
        const element = document.createElement("p")
        element.innerText = `${kanji}: ${count}`
        countElement.appendChild(element)
    }
}

function analizeIncluded(allKanji, countDict, inputList) {
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
            if (nuke1.isSubsetOf(nuke2)) {
                if (nuke1.size === nuke2.size) {
                    if (i < j) {
                        sameJukugo.push([inputList[i], inputList[j]])
                    }
                }
                else {
                    includedJukugo.push([inputList[i], inputList[j]])
                }
            }
        }
    }
    return [includedJukugo, sameJukugo]
}

function showIncluded(includedList) {
    const includedJukugo = includedList[0]
    const sameJukugo = includedList[1]
    if (includedJukugo.length <= 0 && sameJukugo.length <= 0) {
        return
    }
    var includedElement = document.getElementById("includedJukugo")
    includedElement.innerHTML = null
    for (const [jukugo1, jukugo2] of includedJukugo) {
        const element = document.createElement("p")
        element.innerText = jukugo1 + " は " + jukugo2 + " に含まれる"
        includedElement.appendChild(element)
    }
    for (const [jukugo1, jukugo2] of sameJukugo) {
        const element = document.createElement("p")
        element.innerText = jukugo1 + " と " + jukugo2 + " は同じ"
        includedElement.appendChild(element)
    }

}
