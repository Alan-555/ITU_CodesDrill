import { Database } from './database';
import './style.css'
import { CurrentQuestion } from './types';

const code = document.getElementById("code")!;
const input = document.getElementById("input")! as HTMLInputElement;

input.oninput = () => CheckInput();
window.onkeyup = (e) => {
    if (e.key == "Enter" || e.keyCode == 13){
        if(incorrectSkip)
            Incorrect();
        else
            CheckInput(true)
    }
};

window.onload = ReadyNewQuestion;

let currentQuestion: CurrentQuestion;


function SelectNewQuestion() {
    let codes = Database.Codes;
    let randomCode = codes[Math.floor(Math.random() * codes.length)];
    currentQuestion = new CurrentQuestion(randomCode, Database.Data[randomCode], Math.random() >= 0.5);
}

function CheckInput(force = false) {
    let possibleAnswers = Database.GetGuessed(currentQuestion).filter(c => c.toLowerCase().startsWith(input.value.toLowerCase()));
    if (possibleAnswers.length == 1 && (input.value.length / possibleAnswers[0].length) >= 0.5) {
        if (possibleAnswers[0] == currentQuestion.GuessedString)
            Correct();
    }
    if(force){
        if(input.value.toLowerCase() == currentQuestion.GuessedString.toLowerCase())
            Correct();
        else
            Incorrect();
    }
}

function ReadyNewQuestion() {
    SelectNewQuestion();
    code.innerHTML = currentQuestion.GivenString;
    input.value = "";
    input.style.color = "black";
    input.disabled = false;
    input.focus();
}


async function Correct() {
    input.value = currentQuestion.GuessedString;
    input.style.color = "green";
    input.disabled = true;
    await Sleep(1000);
    ReadyNewQuestion();
}

let incorrectSkip = false;

async function Incorrect() {
    if (incorrectSkip) {
        ReadyNewQuestion();
        incorrectSkip = false;
        return;
    }
    input.value = currentQuestion.GuessedString;
    input.style.color = "red";
    input.disabled = true;
    incorrectSkip = true;
}


const Sleep = (time: number) =>
    new Promise((res) => {
        setTimeout(res, time);
    });