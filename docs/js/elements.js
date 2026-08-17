function createBoardElement(problemList, row) {
    const element = document.createElement("span")
    var rowCount = 0
    for (const jukugo of problemList) {
        element.appendChild(createJukugoElement(jukugo))
        rowCount += 1
        if (rowCount % row === 0) {
            const breakElement = document.createElement("span")
            breakElement.innerHTML = "<br>"
            element.appendChild(breakElement)
        }
    }
    return element
}

function createJukugoElement(jukugo) {
    const element = document.createElement("span")
    element.classList.add("jukugo")
    for (const char of jukugo) {
        if (typeof(char) === "number") {
            element.appendChild(createNukeKanjiElement(char))
        } else {
            element.appendChild(createHintKanjiElement(char))
        }
    }
    return element
}

function createHintKanjiElement(kanji) {
    const element = document.createElement("span")
    element.innerText = kanji
    return element
}

function createNukeKanjiElement(number, kanji = "＿") {
    const element = document.createElement("ruby")
    element.innerText = kanji
    element.classList.add(getNukeClass(number))
    element.classList.add("nukeKanji")

    var rtElement = document.createElement("rt")
    rtElement.innerText = viewNumber(number)
    rtElement.classList.add(getRubyClass(number))
    element.appendChild(rtElement)

    return element
}

function createTableElement(length, row) {
    const tableElement = document.createElement("table")
    if (length <= 0) {
        return tableElement
    }

    var start = 0
    var end = Math.min(row, length)
    while (end < length) {
        tableElement.appendChild(createTableHeadElement(start, end))
        tableElement.appendChild(createTableBodyElement(start, end))
        start = end
        end = Math.min(end + row, length)
    }
    tableElement.appendChild(createTableHeadElement(start, length))
    tableElement.appendChild(createTableBodyElement(start, length))

    return tableElement
}

function createTableHeadElement(start, end){
    var headElement = document.createElement("tr")
    for (let number = start; number < end; number++) {
        var thElement = document.createElement("th")
        thElement.innerText = viewNumber(number)
        thElement.id = getTableHeadId(number)
        headElement.appendChild(thElement)
    }
    headElement.addEventListener("click", clickProblem)
    return headElement
}

function createTableBodyElement(start, end) {
    var bodyElement = document.createElement("tr")
    for (let number = start; number < end; number++) {
        var tdElement = document.createElement("td")
        tdElement.appendChild(createInputCharElement(number))
        bodyElement.appendChild(tdElement)
    }
    return bodyElement
}

function createInputCharElement(number) {
    var inputElement = document.createElement("input")
    inputElement.id = getCharInputId(number)
    inputElement.classList.add("charInput")
    inputElement.addEventListener("change", function(){writeChar(number)})
    inputElement.addEventListener("focusin", function(){clearHighlight(); highlight(number)})
    return inputElement
}

function getNukeClass(number) {
    return "nuke" + String(number)
}

function getRubyClass(number) {
    return "ruby" + String(number)
}

function getTableHeadId(number) {
    return "table" + String(number)
}

function getCharInputId(number) {
    return "input" + String(number)
}

function getNumberOfElement(element){
    if (!element) {
        return -1
    }
    const id = element.id
    if (getTableHeadNumber(id) >= 0 ) {
        return getTableHeadNumber(id)
    }
    if (getCharInputNumber(id) >= 0 ) {
        return getCharInputNumber(id)
    }
    const classList = element.classList
    if (getNukeNumber(classList) >= 0) {
        return getNukeNumber(classList)
    }
    if (getRubyNumber(classList) >= 0) {
        return getRubyNumber(classList)
    }
    return -1
}

function getNukeNumber(classList) {
    for (const className of classList) {
        if(className.startsWith("nuke")) {
            return Number(className.substring(4))
        }
    }
    return -1
}

function getRubyNumber(classList) {
    for (const className of classList) {
        if(className.startsWith("ruby")) {
            return Number(className.substring(4))
        }
    }
    return -1
}

function getCharInputNumber(id) {
    if (id.startsWith("input")) {
        return Number(id.substring(5))
    }
    return -1
}

function getTableHeadNumber(id) {
    if (id.startsWith("table")) {
        return Number(id.substring(5))
    }
    return -1
}