document.getElementById("inputText").addEventListener("input", update)

document.getElementById("showEditUrl").addEventListener("click", function(){showUrl(true, false)} );
document.getElementById("showSolveUrl").addEventListener("click", function(){showUrl(false, false)} );
document.getElementById("showSolveCheckUrl").addEventListener("click", function(){showUrl(false, true)} );

document.getElementById("problem").addEventListener("click", clickProblem);

function setProblem() {
    var params = new URLSearchParams(document.location.search);
    var isEdit = true
    if (params.has("m") && params.get("m") != "edit" ) {
        isEdit = false
    }
    setMode(isEdit)
    var problemList = []
    if (params.has("p")) {
        problemList = decodeProblem(params.get("p"))
    }
    var answerList = []
    if (params.has("a")) {
        answerList = decodeAnswer(params.get("a"))
    }
    var row = params.has("r") ? Number(params.get("r")) : 4
    show(problemList, answerList, row, isEdit)
    document.getElementById("inputText").value = problemToInput(problemList, answerList)
    document.getElementById("setRow").value = row
}
setProblem();

function update() {
    const problemText = document.getElementById("inputText").value
    const row = document.getElementById("setRow").value
    const [problemList, answerList] = inputToList(problemText)
    show(problemList, answerList, Number(row))
}

function show(problemList, answerList, row, isEdit = true) {
    if (problemList.length === 0) {
        return
    }

    showProblem(problemList, row)
    if (isEdit) {
        showAnswer(answerList)
        analytics(problemList, answerList)
    }
}

function showProblem (problemList, row) {
    var problemElement = document.getElementById("problem")
    problemElement.innerHTML = null
    problemElement.appendChild(createProblemElement(problemList, row))
}

function showAnswer(answerList) {
    var answerElement = document.getElementById("answer")
    answerElement.innerHTML = null
    answerElement.appendChild(createAnswerElement(answerList.length))
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

    const problem = inputToProblem(text)
    params.append("p", encodeProblem(problem))
    if (isEdit || isCheck) {
        params.append("a", encodeAnswer(problem))
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