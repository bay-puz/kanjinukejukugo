document.getElementById("inputText").addEventListener("input", update)
document.getElementById("boardRow").addEventListener("change", update);
document.getElementById("tableRow").addEventListener("change", update);

document.getElementById("showEditUrl").addEventListener("click", function(){showUrl(true, false)});
document.getElementById("showSolveUrl").addEventListener("click", function(){showUrl(false, false)});
document.getElementById("showSolveCheckUrl").addEventListener("click", function(){showUrl(false, true)});

document.getElementById("orderForward").addEventListener("click", function(){changeOrder("forward")});
document.getElementById("orderBackward").addEventListener("click", function(){changeOrder("backward")});
document.getElementById("orderRandom").addEventListener("click", function(){changeOrder("random")});


document.getElementById("problem").addEventListener("click", clickProblem);

document.getElementById("checkAnswer").addEventListener("click", checkAnswer);


function show() {
    const isEdit = isEditMode()

    if (isEdit) {
        const params = new URLSearchParams(document.location.search);
        const inputList = params.has("t") ? decodeList(params.get("t")) : []
        const answerList = params.has("a") ? decodeAnswer(params.get("a")) : []
        setInput(inputList)
        showEditMode(inputList, answerList)
    }
    else {
        showSolveMode()
    }
}
show();

function showEditMode(inputList, baseList) {
    setMode(true)
    showAnalytics(inputList)
    const answerList = makeAnswerList(inputList, baseList)
    const problemList = makeProblemList(inputList, answerList)
    showProblem(problemList)
    setAnswerList(answerList)
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
        const inputList = getInputList()
        const answerList = getAnswerList()
        showEditMode(inputList, answerList)
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
    const answerList = getAnswerList()

    if (isEdit) {
        params.append("m", "edit")
        params.append("t", encodeList(inputList))
        params.append("a", encodeAnswer(answerList))
    }
    else {
        params.append("m", "solve")
        const problemList = makeProblemList(inputList, answerList)
        params.append("p", encodeProblem(problemList))
        if (isCheck) {
            params.append("a", encodeAnswer(answerList))
        }
    }

    const url = new URL(location.href)
    url.search = params;
    setUrl(url)
}

function changeOrder(order) {
    var answerList = getAnswerList()
    const inputList = getInputList()
    const writtenDict = getWrittenChars()

    var writtenAnserDict = {}
    for (const [num, kanji] of Object.entries(writtenDict)) {
        const answerKanji = answerList[num]
        writtenAnserDict[answerKanji] = kanji
    }

    if (order === "forward") {
        answerList = makeAnswerList(inputList)
    }
    else if (order === "backward") {
        var reverseInputList = inputList.toReversed()
        answerList = makeAnswerList(reverseInputList)
    }
    else if (order === "random") {
        for (var i = answerList.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1))
            const temp = answerList[i]
            answerList[i] = answerList[j]
            answerList[j] = temp
        }
    }
    showEditMode(inputList, answerList)

    var newWrittenDict = {}
    for (const [answerKanji, writtenKanji] of Object.entries(writtenAnserDict)) {
        const num = answerList.indexOf(answerKanji)
        newWrittenDict[num] = writtenKanji
    }
    setWrittenChars(newWrittenDict)
}

function clickProblem(event) {
    var element = document.elementFromPoint(event.clientX, event.clientY)
    highlightElement(element)
}

function checkAnswer() {
    const answerList = decodeAnswer(new URLSearchParams(document.location.search).get("a"))
    var writtenDict = getWrittenChars()
    if (Object.keys(writtenDict).length < answerList.length) {
        alert("未完成です。")
        return
    }

    var isCorrect = true
    for (const [num, write] of Object.entries(writtenDict)) {
        if (write != answerList[num]) {
            isCorrect = false
            break
        }
    }
    alert(isCorrect ? "正解です！" : "不正解です。")
}