function writeChar(number) {
    const inputElement = document.getElementById(getCharInputId(number))
    const inputChar = inputElement.value

    var charElements = document.getElementsByClassName(getNukeClass(number))
    for (var charElement of charElements) {
        const newElement = createNukeKanjiElement(number, inputChar)
        charElement.replaceWith(newElement)
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
