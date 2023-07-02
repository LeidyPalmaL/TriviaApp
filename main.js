document.addEventListener('DOMContentLoaded', init);
var validationMap = new Map();
var score = 0;

function init(){
    const buttonGenerateTriva = document.getElementById("generateTrivia");
    buttonGenerateTriva.addEventListener('click', generateTrivia);

    const selectCategory = document.getElementById("selectCategory");
    const selectDifficulty = document.getElementById("selectDifficulty");
    const selectType = document.getElementById("selectType");

    const trivia = document.getElementById("trivia");

    const footer = document.getElementById('footer');

    consumirAPI(`https://opentdb.com/api_category.php`, showConfig);
}

function consumirAPI(url, callback) {
    console.log(url);
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => callback(result))
        .catch(error => console.log('error', error));
}

function showTrivia(result){
    score = 0;
    var objetoTrivia = JSON.parse(result);
    if (objetoTrivia.response_code == 0) {
        for (const result of objetoTrivia.results) {
            showQuestionsAndAnswers(result);
        }
        let divButton = document.createElement('div');

        let button = document.createElement('button');
        button.id = "validate";
        button.textContent = "Validate";
        button.addEventListener('click', validateTrivia)
    
        divButton.appendChild(button);
        trivia.appendChild(divButton);
    
    }
}

function showQuestionsAndAnswers(result) {
    console.log(result.question);
    let div = document.createElement('div');
    div.classList.add('pair');
    let label = document.createElement('label');
    label.innerHTML = `${result.question} `;

    validationMap.set(result.question, result.correct_answer);

    div.appendChild(label);

    let select = document.createElement('select');
    select.id = result.question;

    let answers = showAnswers(result);
    for (const answer of answers) {
        let option = document.createElement('option');
        option.value = answer;
        option.innerHTML = answer;

        select.appendChild(option);
    }
    div.appendChild(select);

    trivia.appendChild(div);

    console.log(answers);
}

function showAnswers(result) {
    let answers = [];

    answers[0] = result.correct_answer;
    for (let index = 0; index < result.incorrect_answers.length; index++) {
        answers[index + 1] = result.incorrect_answers[index];
    }
    return answers.sort();
}

function showConfig(result){
    let objectCategories = JSON.parse(result);
    // let mapCategories = new Map();
    for (const category of objectCategories.trivia_categories) {
        // mapCategories.set(category.name, category.id);
        
        let optionCategory = document.createElement('option');
        optionCategory.value = category.id;
        optionCategory.textContent = category.name;

        selectCategory.appendChild(optionCategory);

        console.log(category.name);
    }
    // let categoríaElegida = prompt("Cuál categoría quiere? ");

    let arrayDifficulties = ["easy", "medium", "hard", "any"];
    console.log(arrayDifficulties);
    for (const difficulty of arrayDifficulties) {
        let optionDifficulty = document.createElement('option');
        optionDifficulty.value = difficulty;
        optionDifficulty.textContent = difficulty;

        selectDifficulty.appendChild(optionDifficulty);
    }

    // let difficulty = prompt("Qué grado de dificultad quiere? ");

    let mapAnswerType = new Map([
        ["multiple", "Multiple"], 
        ["boolean", "False/True"], 
        ["any", "Any Choice"]
    ]);
    console.log(mapAnswerType);
    for (const [key, value] of mapAnswerType) {
        let optionType = document.createElement('option');
        optionType.value = key;
        optionType.textContent = value;

        selectType.appendChild(optionType);
    }    

    // let type = prompt("Qué tipo de respuesta quiere? ");
    // let typeParam = "";
    // if (type != "any") {
    //     typeParam = `&type=${type}`;
    // }

}

function generateTrivia(){
    clearContainer(trivia);

    let category = selectCategory.value;
    let difficulty = selectDifficulty.value;
    let type = selectType.value;

    let difficultyParam = "";
    if (difficulty != "any") {
        difficultyParam = `&difficulty=${difficulty}`;
    }

    let typeParam = "";
    if (type != "any") {
        typeParam = `&type=${type}`;
    }
    
    consumirAPI(`https://opentdb.com/api.php?amount=10&category=${category}${difficultyParam}${typeParam}`, showTrivia);
}

function clearContainer(container) {
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function validateTrivia(){
    let childs = trivia.childNodes;

    for (const child of childs) {
        for (const subChild of child.childNodes) {
            if (subChild.nodeName == 'SELECT') {
                console.log(subChild.id);    
                console.log(subChild.value);
                console.log(validationMap.get(subChild.id));
                if (subChild.value == validationMap.get(subChild.id)) {
                    score += 100;
                }
            }
        }
    }

    clearContainer(footer);
    let p = document.createElement('p');
    p.innerHTML = "Your score is <span id='score'></span>."
    footer.appendChild(p);

    let spanSocore = document.getElementById('score');
    spanSocore.textContent = score;
}
