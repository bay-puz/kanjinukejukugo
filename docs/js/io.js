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

    return [Number[boardRow], Number[tableRow]]
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
    document.getElementById("checkAnswer").addEventListener("click", function(){checkAnswer()} );
}

function writeChar(num) {
    const inputElement = document.getElementById(getCharInputId(num))
    const inputChar = inputElement.value
    writeBoard(num, inputChar)
}

function writeBoard(num, char) {
    if (char.length != 1) {
        return
    }
    var charElements = document.getElementsByClassName(getNukeClass(num))
    for (var charElement of charElements) {
        const newElement = createNukeKanjiElement(num, char)
        charElement.replaceWith(newElement)
    }
}

function getWrittenChars() {
    var writtenDict = {}
    const inputElements = document.getElementsByClassName("charInput")
    for (const inputELement of inputElements) {
        const char = inputELement.value
        if (char.length < 1) {
            continue
        }
        const number = getInputIdNumber(inputELement.id)
        writtenDict[number] = char
    }
    return writtenDict
}

function setWrittenChars(writtenDict) {
    for (const [n, char] of Object.entries(writtenDict)) {
        const num = Number(n)
        const element = document.getElementById(getCharInputId(num))
        element.value = char
        writeBoard(num, char)
    }
}

function highlightElement(element) {
    if(element === null) return
    clearHighlight()
    var number = -1
    if(element.id.startsWith("table")) {
        number = Number(element.id.substring(5))
    }
    else if(element.id.startsWith("input")) {
        number = Number(element.id.substring(5))
    }
    else {
        for(const elementClass of element.classList){
            const getNumber = getNukeClassNumber(elementClass)
            if (getNumber >= 0) {
                number = getNumber
            }
        }
    }
    if(number >= 0) {
        highlight(number)
    }
}

function highlight(number) {
    var elements = document.getElementsByClassName(getNukeClass(number))
    for (var element of elements) {
        element.classList.add("highlight")
    }
    if (document.getElementById(getTableId(number)) !== null) {
        document.getElementById(getTableId(number)).classList.add("highlight")
        document.getElementById(getCharInputId(number)).focus()
    }
}

function clearHighlight() {
    const elements = document.getElementsByClassName("highlight")
    while (elements.length > 0) {
        elements[0].classList.remove("highlight")
    }
}