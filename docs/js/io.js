function isEditMode() {
    const params = new URLSearchParams(document.location.search);
    return (!params.has("m") || params.get("m") == "edit" )
}

function getInputList() {
    const text = document.getElementById("inputText").value

    var inputList = []
    for (line of text.split('\n')) {
        line = line.trim()
        if (line.length === 0 || line.startsWith('#')) {
            continue
        }
        inputList.push(line)
    }
    return inputList
}

function getRows() {
    const boardRow = document.getElementById("boardRow").value
    const tableRow = document.getElementById("tableRow").value

    return [Number(boardRow), Number(tableRow)]
}

function getOrder() {
    return document.querySelectorAll('input[name="order"]:checked')
}

function setMode(isEdit) {
    const hiddenClass = (isEdit) ? "displaySolveMode" : "displayEditMode"
    var elements = document.getElementsByClassName(hiddenClass);
    for (const element of elements) {
        element.classList.add("hidden")
    }
}

function setInput(inputList) {
    var inputElement = document.getElementById("inputText")
    inputElement.value = inputList.join('\n')
}

function setBoard (problemList, row) {
    var problemElement = document.getElementById("board")
    problemElement.innerHTML = null
    problemElement.appendChild(createBoardElement(problemList, row))
}

function setTable (tableLength, tableRow) {
    var answerElement = document.getElementById("table")
    answerElement.innerHTML = null
    answerElement.appendChild(createTableElement(tableLength, tableRow))
}

function setUrl (url) {
    var urlElement = document.getElementById("showURL")
    urlElement.href = url
    urlElement.innerText = url.toString()
    var lineElement = document.getElementById("URLLine")
    lineElement.classList.remove("hidden")
}

function setAnswerCheck() {
    var answerCheckErea = document.getElementById("answerCheckErea")
    answerCheckErea.classList.remove("hidden")
}

function setAnswerList(answerList) {
    for (const [num, kanji] of answerList.entries()) {
        const element = document.getElementById(getTableHeadId(num))
        if (!element) {
            continue;
        }
        var answerElement = document.createElement("span")
        answerElement.id = getAnswerId(num)
        answerElement.innerText = kanji
        answerElement.classList.add("hidden")
        answerElement.classList.add("answer")
        element.appendChild(answerElement)
    }
}

function getAnswerList() {
    var answerDict = {}
    const answerElements = document.getElementsByClassName("answer")
    for (const element of answerElements) {
        num = getAnswerNumber(element.id)
        kanji = element.innerText
        answerDict[num] = kanji
    }
    var answerList = []
    for (let num = 0; num < Object.keys(answerDict).length; num++) {
        answerList.push(answerDict[num])
    }
    return answerList
}

function inputFromTable(num) {
    const inputElement = document.getElementById(getCharInputId(num))
    const inputChar = inputElement.value
    if (inputChar.length > 1) {
        return
    }
    if (inputChar.length === 0) {
        deleteChar(num)
    }
    else {
        writeChar(num, inputChar)
    }
}

function writeChar(num, char) {
    var charElements = document.getElementsByClassName(getNukeClass(num))
    for (var charElement of charElements) {
        const newElement = createNukeKanjiElement(num, char)
        charElement.replaceWith(newElement)
    }
}

function deleteChar(num) {
    writeChar(num, defaultChar())
}

function getWrittenChars() {
    var writtenDict = {}
    const inputElements = document.getElementsByClassName("charInput")
    for (const inputELement of inputElements) {
        const char = inputELement.value
        if (char.length < 1) {
            continue
        }
        const number = getCharInputNumber(inputELement.id)
        writtenDict[number] = char
    }
    return writtenDict
}

function setWrittenChars(writtenDict) {
    for (const [n, char] of Object.entries(writtenDict)) {
        const num = Number(n)
        const element = document.getElementById(getCharInputId(num))
        if (!element) {
            continue
        }
        element.value = char
        writeChar(num, char)
    }
}

function highlightElement(element) {
    if(element === null) return
    clearHighlight()
    const number = getNumberOfElement(element)
    if(number >= 0) {
        highlight(number)
    }
}

function highlight(number) {
    var nukeElements = document.getElementsByClassName(getNukeClass(number))
    for (var nukeElement of nukeElements) {
        nukeElement.classList.add("highlight")
    }
    var rubyElements = document.getElementsByClassName(getRubyClass(number))
    for (var rubyElement of rubyElements) {
        rubyElement.classList.add("highlight")
    }

    var tableElement = document.getElementById(getTableHeadId(number))
    if (tableElement !== null) {
        tableElement.classList.add("highlight")
    }
    var inputElement = document.getElementById(getCharInputId(number))
    if (inputElement !== null) {
        inputElement.focus()
    }

}

function clearHighlight() {
    const elements = document.getElementsByClassName("highlight")
    while (elements.length > 0) {
        elements[0].classList.remove("highlight")
    }
}