document.getElementById("inputText").addEventListener("input", update)

document.getElementById("showEditUrl").addEventListener("click", function(){showUrl(true, false)} );
document.getElementById("showSolveUrl").addEventListener("click", function(){showUrl(false, false)} );
document.getElementById("showSolveCheckUrl").addEventListener("click", function(){showUrl(false, true)} );

document.getElementById("board").addEventListener("click", clickProblem);
document.getElementById("table").addEventListener("click", clickProblem);

function setProblem() {
    var params = new URLSearchParams(document.location.search);
    if (params.has("m") && params.get("m") != "edit" ) {
        setSolveMode(params)
    }
    else {
        setEditMode(params)
    }
}
setProblem();

function setEditMode(params) {
    setMode(true)
    var row = params.has("r") ? Number(params.get("r")) : 4

    const inputList = params.has("t") ? decodeList(params.get("t")) : []
    setInput(inputList, row)

    const [problemList, answerList] = ListToProblem(inputList)
    show(problemList, row)
}

function setSolveMode(params) {
    setMode(false)
    var row = params.has("r") ? Number(params.get("r")) : 4
    const problemList = params.has("p") ? decodeProblem(params.get("p")) : []
    const answerList = params.has("a") ? decodeAnswer(params.get("a")) : []
    show(problemList, row)
}

function update() {
    const problemText = document.getElementById("inputText").value
    const row = document.getElementById("setRow").value
    const [problemList, answerList] = ListToProblem(inputToList(problemText))
    show(problemList, Number(row))
}

function setInput(inputList, row) {
    var inputElement = document.getElementById("inputText")
    inputElement.value = inputList.join('\n')
}

function show(problemList, row) {
    if (problemList.length === 0) {
        return
    }
    const tableLength = getTableLength(problemList)
    const tableRow = 30

    showBoard(problemList, row)
    showTable(tableLength, tableRow)
    analytics(problemList)
}

function showBoard (problemList, row) {
    var problemElement = document.getElementById("board")
    problemElement.innerHTML = null
    problemElement.appendChild(createBoardElement(problemList, row))
}

function showTable (tableLength, tableRow) {
    var answerElement = document.getElementById("table")
    answerElement.innerHTML = null
    answerElement.appendChild(createTableElement(tableLength, tableRow))
}

function showUrl(isEdit, isCheck) {
    var params = new URLSearchParams();
    if (isEdit) {
        params.append("m", "edit")
    } else {
        params.append("m", "solve")
    }

    const text = document.getElementById("inputText").value
    const row = document.getElementById("setRow").value

    const inputList = inputToList(text)

    if (isEdit) {
        const inputList = inputToList(text)
        params.append("t", encodeList(inputList))
    }
    else {
        const [problemList, answerList] = ListToProblem(inputList)
        params.append("p", encodeProblem(problemList))
        if (isCheck) {
            params.append("a", encodeAnswer(answerList))
        }
    }
    params.append("r", row)

    const url = new URL(location.href)
    url.search = params;
    var urlElement = document.getElementById("showURL")
    urlElement.href = url
    urlElement.innerText = url.toString()
    var lineElement = document.getElementById("URLLine")
    lineElement.classList.remove("hidden")
}

function setMode(isEdit) {
    const hiddenClass = (isEdit) ? "displaySolveMode" : "displayEditMode"
    var elements = document.getElementsByClassName(hiddenClass);
    for (const element of elements) {
        element.classList.add("hidden")
    }
}

function clickProblem(event) {
    var element = document.elementFromPoint(event.clientX, event.clientY)
    highlightElement(element)
}