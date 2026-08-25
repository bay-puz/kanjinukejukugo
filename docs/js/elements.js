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

function createNukeKanjiElement(number, kanji = "") {
    kanji = (kanji.length === 0)? defaultChar(): kanji
    const element = document.createElement("ruby")
    element.innerText = kanji
    element.classList.add(getNukeClass(number))

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
    inputElement.addEventListener("change", function(){inputFromTable(number)})
    inputElement.addEventListener("focusin", function(){clearHighlight(); highlight(number)})
    return inputElement
}

function defaultChar() {
    return "＿"
}

function viewNumber(num) {
    return (num + 1).toString()
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

function getAnswerId(number) {
    return "answer" + String(number)
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

function getNumberInClass(name, classList) {
    for (const className of classList) {
        if(className.startsWith(name)) {
            return Number(className.substring(name.length))
        }
    }
    return -1
}

function getNukeNumber(classList) {
    return getNumberInClass("nuke", classList)
}

function getRubyNumber(classList) {
    return getNumberInClass("ruby", classList)
}

function getNumberInId(name, id) {
    if (id.startsWith(name)) {
        return Number(id.substring(name.length))
    }
    return -1
}

function getCharInputNumber(id) {
    return getNumberInId("input", id)
}

function getTableHeadNumber(id) {
    return getNumberInId("table", id)
}

function getAnswerNumber(id) {
    return getNumberInId("answer", id)
}