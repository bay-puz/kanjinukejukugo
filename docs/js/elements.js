function createProblemElement(problem, row) {
    const element = document.createElement("span")
    for (const jukugo of problem) {
        element.appendChild(createJukugoElement(jukugo))
    }
    return element
}

function createJukugoElement(jukugo) {
    const element = document.createElement("p")
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
    element.appendChild(rtElement)

    return element
}

function createAnswerElement(length, answerRow = 30) {
    const tableElement = document.createElement("table")
    if (length <= 0) {
        return tableElement
    }

    var start = 0
    var end = Math.min(answerRow, length)
    while (end < length) {
        tableElement.appendChild(createAnswerHeadElement(start, end))
        tableElement.appendChild(createAnswerBodyElement(start, end))
        start = end
        end = Math.min(end + answerRow, length)
    }
    tableElement.appendChild(createAnswerHeadElement(start, length))
    tableElement.appendChild(createAnswerBodyElement(start, length))

    return tableElement
}

function createAnswerHeadElement(start, end){
    var headElement = document.createElement("tr")
    for (let number = start; number < end; number++) {
        var thElement = document.createElement("th")
        thElement.innerText = viewNumber(number)
        thElement.id = getAnswerId(number)
        headElement.appendChild(thElement)
    }
    headElement.addEventListener("click", clickProblem)
    return headElement
}

function createAnswerBodyElement(start, end) {
    var bodyElement = document.createElement("tr")
    for (let number = start; number < end; number++) {
        var tdElement = document.createElement("td")
        tdElement.appendChild(createInputCharElement(number))
        bodyElement.appendChild(tdElement)
    }
    return bodyElement
}

function createInputCharElement(number) {
    const elementId = getCharInputId(number)
    var inputElement = document.createElement("input")
    inputElement.id = elementId
    inputElement.classList.add("charInput")
    inputElement.addEventListener("change", function(){writeChar(number)})
    inputElement.addEventListener("focusin", function(){clearHighlight(); highlight(number)})
    return inputElement
}

function writeChar(number) {
    const inputElement = document.getElementById(getCharInputId(number))
    const inputChar = inputElement.value

    var charElements = document.getElementsByClassName(getNukeClass(number))
    for (var charElement of charElements) {
        const newElement = createNukeKanjiElement(number, inputChar)
        charElement.replaceWith(newElement)
    }
}

function getNukeClass(number) {
    return "nuke" + String(number)
}

function getAnswerId(number) {
    return "answer" + String(number)
}

function getCharInputId(number) {
    return "input" + String(number)
}

function getNukeClassNumber(className) {
    if(className.startsWith("nuke")) {
        return Number(className.substring(4))
    }
    return -1
}

function highlightElement(element) {
    if(element === null) return
    clearHighlight()
    var number = -1
    if(element.id.startsWith("answer")) {
        number = Number(element.id.substring(6))
    }
    else {
        for(const elementClass of element.classList){
            const getNumber = getNukeClassNumber(elementClass)
            if (getNumber >= 0) {
                number = getNumber
            }
        }
    }
    highlight(number)
}

function highlight(number) {
    var elements = document.getElementsByClassName(getNukeClass(number))
    for (var element of elements) {
        element.classList.add("highlight")
    }
    document.getElementById(getAnswerId(number)).classList.add("highlight")
    document.getElementById(getCharInputId(number)).focus()
}

function clearHighlight() {
    const elements = document.getElementsByClassName("highlight")
    while (elements.length > 0) {
        elements[0].classList.remove("highlight")
    }
}
