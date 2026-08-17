document.getElementById("inputText").addEventListener("input", update)
document.getElementById("boardRow").addEventListener("change", update);
document.getElementById("tableRow").addEventListener("change", update);

document.getElementById("showEditUrl").addEventListener("click", function(){showUrl(true, false)} );
document.getElementById("showSolveUrl").addEventListener("click", function(){showUrl(false, false)} );
document.getElementById("showSolveCheckUrl").addEventListener("click", function(){showUrl(false, true)} );

document.getElementById("board").addEventListener("click", clickProblem);
document.getElementById("table").addEventListener("click", clickProblem);

function show() {
    const isEdit = isEditMode()

    var problemList = []
    if (isEdit) {
        const params = new URLSearchParams(document.location.search);
        const inputList = params.has("t") ? decodeList(params.get("t")) : []
        showEditMode(inputList)
        setInput(inputList)
    }
    else {
        showSolveMode()
    }
}
show();

function showEditMode(inputList) {
    setMode(true)
    showAnalytics(inputList)
    showProblem(listToProblem(inputList))
}

function showSolveMode() {
    setMode(false)
    const params = new URLSearchParams(document.location.search);
    const problemList = params.has("p") ? decodeProblem(params.get("p")) : []
    showProblem(problemList)
    if(params.has("a")) {
        setAnswerCheck()
    }
}

function update() {
    const written = getWrittenChars()
    if (isEditMode()) {
        showEditMode(getInputList())
    }
    else {
        showSolveMode()
    }
    setWrittenChars(written)
}

function showProblem(problemList) {
    if (problemList.length === 0) {
        return
    }
    const [boardRow, tableRow] = getRows()
    const tableLength = culcTableLength(problemList)
    setBoard(problemList, boardRow)
    setTable(tableLength, tableRow)
}

function showUrl(isEdit, isCheck) {
    var params = new URLSearchParams();
    const inputList = getInputList()

    if (isEdit) {
        params.append("m", "edit")
        params.append("t", encodeList(inputList))
    }
    else {
        params.append("m", "solve")
        const problemList = listToProblem(inputList)
        params.append("p", encodeProblem(problemList))
        if (isCheck) {
            const answerList = listToAnswer(inputList)
            params.append("a", encodeAnswer(answerList))
        }
    }

    const url = new URL(location.href)
    url.search = params;
    setUrl(url)
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