import { Database } from './database';
import './style.css'
import { CurrentQuestion } from './types';
import "./editor.ts";
import { IsEditorHidden, ToggleEditor } from './editor.ts';

const code = document.getElementById("code")!;
const input = document.getElementById("input")! as HTMLInputElement;

const gameElement = document.getElementById("game")!;

input.oninput = () => CheckInput();
window.onkeyup = (e) => {
    if(
        //game is hidden - no input
        document.getElementById("game")!.hidden ||
        //if disabled, don't allow interaction, unless we are to skip an incorrect question
        (
            input.disabled && !incorrectSkip
        )
    )
        return;
    if (e.key == "Enter" || e.keyCode == 13){
        if(incorrectSkip)
            Incorrect();
        else
            CheckInput(true)
    }
};


let gameStart = false;
let currentQuestion: CurrentQuestion;

export function StartGame(){
    gameStart = true;
    document.getElementById("noDataNotice")!.hidden = true;
    if(IsEditorHidden())
        SetGameHiddenState(false);
    ReadyNewQuestion();
}

export function SetGameHiddenState(hidden : boolean){
    if(!gameStart) return;
    gameElement.hidden = hidden;
}

function SetHelper(text = "Stiskni Enter pro potvrzení"){
    document.getElementById("helper")!.innerHTML = text;
}

function SelectNewQuestion() {
    SetHelper();
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
    SetHelper("Stiskni ENTER");
    input.value = currentQuestion.GuessedString;
    input.style.color = "red";
    input.disabled = true;
    incorrectSkip = true;
}


const Sleep = (time: number) =>
    new Promise((res) => {
        setTimeout(res, time);
    });