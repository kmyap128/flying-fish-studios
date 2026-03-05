import { Game } from "../game/classes/game.js";

const optionButtons = document.querySelectorAll(".option");
const lockInButton = document.getElementById("completeButton");
const timerElement = document.getElementById("timer");
const circle = document.querySelector(".timer-circle");
let selectedOption = null;


const game = new Game([], null, null, optionButtons, lockInButton, timerElement, circle);

async function init() {
    await game.loadScenarios();
    game.loadCurrentScenario();
}

init();
lockInButton.disabled = true;

optionButtons.forEach((button, index) => {
    button.addEventListener("click", () => {

        // Remove previous selection
        optionButtons.forEach(btn => btn.classList.remove("selected"));

        // Mark current as selection
        button.classList.add("selected");
        game.selectedOption = button.textContent;
        game.selectedOptionIndex = index;

        // Enable the lock in button
        lockInButton.disabled = false;
    });
});

lockInButton.addEventListener("click", () => {
    console.log(game.selectedOption);
    if (game.selectedOption === null) return;

    game.round.stopTimer();

    console.log("LOCKED IN:", game.selectedOption);
    game.endRound()
});