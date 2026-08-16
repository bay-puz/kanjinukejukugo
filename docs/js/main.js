document.getElementById("inputText").addEventListener("input", update)
document.getElementById("boardRow").addEventListener("change", update);
document.getElementById("tableRow").addEventListener("change", update);

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

    const inputList = params.has("t") ? decodeList(params.get("t")) : []
    setInput(inputList)
    showAnalytics(inputList)

    const [problemList, answerList] = ListToProblem(inputList)
    show(problemList)
}

function setSolveMode(params) {
    setMode(false)
    const problemList = params.has("p") ? decodeProblem(params.get("p")) : []
    show(problemList)
    if (params.has("a")) {
        setAnswerCheck()
    }
}

function update() {
    const problemText = document.getElementById("inputText").value
    const boardRow = document.getElementById("boardRow").value
    const tableRow = document.getElementById("tableRow").value
    const inputList = inputToList(problemText)
    const [problemList, answerList] = ListToProblem(inputList)
    show(problemList, Number(boardRow), Number(tableRow))
    showAnalytics(inputList)
}

function setInput(inputList) {
    var inputElement = document.getElementById("inputText")
    inputElement.value = inputList.join('\n')
}

function show(problemList, boardRow = 4, tableRow = 30) {
    if (problemList.length === 0) {
        return
    }
    const tableLength = getTableLength(problemList)

    showBoard(problemList, boardRow)
    showTable(tableLength, tableRow)
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

function setAnswerCheck() {
    var answerCheckErea = document.getElementById("answerCheckErea")
    answerCheckErea.classList.remove("hidden")
    document.getElementById("checkAnswer").addEventListener("click", function(){checkAnswer()} );
}

function checkAnswer() {
    const answerList = decodeAnswer(new URLSearchParams(document.location.search).get("a"))
    var solveList = []
    document.querySelectorAll(".charInput").forEach(function(inputElement) {
        solveList.push(inputElement.value)
    });
    var isCorrect = true
    for (let i = 0; i < answerList.length; i++) {
        if (solveList[i] !== answerList[i]) {
            isCorrect = false
            break
        }
    }
    alert(isCorrect ? "正解です！" : "不正解です。")
}

function clickProblem(event) {
    var element = document.elementFromPoint(event.clientX, event.clientY)
    highlightElement(element)
}