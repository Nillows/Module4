// Grabbing HTML elements and assigning them to variables for manipulation.
const startButton = document.getElementById('start-quiz');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const timerElement = document.getElementById('time');
const finalScoreElement = document.getElementById('final-score');
const resultContainerElement = document.getElementById('result-container');
const initialsInput = document.getElementById('initials');
const saveScoreButton = document.getElementById('save-score');
const highScoresElement = document.getElementById('high-scores');
const scoreList = document.getElementById('score-list');
const clearScoresButton = document.getElementById('clear-scores');

// Defining variables to keep track of the quiz state and score.
let firstClick = true;
let shuffledQuestions, currentQuestionIndex,timerInterval;
let quizTimer = 60;
let correctAnswers = 0;
let quizActive = false;

// This is where I define what the start button does when it's clicked.
startButton.addEventListener('click', startGame);

// This function sets up the game when the start button is clicked.
function startGame() {
    quizActive = true; // Indicating that the quiz is active.
    startButton.classList.add('hide'); // Hiding the start button.
    shuffledQuestions = questions.sort(() => Math.random() - 0.5); // Shuffling the questions.
    currentQuestionIndex = 0; // Resetting the question index.
    questionContainerElement.classList.remove('hide'); // Showing the question container.
    setNextQuestion(); // Moving to the next question.
    startTimer(); // Starting the timer.
}

// This function prepares the next question to be shown.
function setNextQuestion() {
    resetState(); // Resetting the state before showing the next question.
    showQuestion(shuffledQuestions[currentQuestionIndex]); // Displaying the next question.
}

// This function controls the countdown timer.
function startTimer() {
    timerElement.textContent = quizTimer; // Displaying the initial timer value.
    timerInterval = setInterval(() => { // Setting up the timer to decrement.
        quizTimer--;
        if (quizTimer <= 0) {
            quizTimer = 0; // Ensuring the timer doesn't go below 0.
            clearInterval(timerInterval); // Stopping the timer.
            endGame(); // Ending the game when the timer runs out.
        }
        timerElement.textContent = quizTimer; // Updating the timer display.
    }, 1000);
}

// This function handles the display of the current question and its answers.
function showQuestion(question) {
    questionElement.innerText = question.question; // Displaying the question text.
    question.answers.forEach(answer => { // Looping through each answer.
        const button = document.createElement('button'); // Creating a button for each answer.
        button.innerText = answer.text; // Setting the answer text.
        button.classList.add('btn'); // Adding styling to the button.
        if (answer.correct) {
            button.dataset.correct = answer.correct; // Marking the correct answer.
        }
        button.addEventListener('click', selectAnswer); // Setting up what happens when an answer is clicked.
        answerButtonsElement.appendChild(button); // Adding the button to the document.
    });
}

// This function resets the state between questions.
function resetState() {
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild); // Removing old answer buttons.
    }
}

// This function provides visual feedback for correct and incorrect answers.
function setStatusClass(element, correct) {
    if (correct) {
        element.classList.add('correct'); // Adding the 'correct' class.
    } else {
        element.classList.add('wrong'); // Adding the 'wrong' class.
    }
}

// This function determines what happens when an answer is selected.
function selectAnswer(e) {
    if (!quizActive) return; // Exiting early if the quiz isn't active.
    const selectedButton = e.target; // Identifying the clicked button.
    const correct = selectedButton.dataset.correct; // Checking if the clicked button is correct.
    setStatusClass(document.body, correct); // Updating the status class based on correctness.
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct); // Updating the status class for each button.
    });
    if (correct) {
        correctAnswers++; // Incrementing the correct answers count.
    } else {
        quizTimer -= 10; // Subtracting time for incorrect answers.
        if (quizTimer < 0) quizTimer = 0; // Ensuring the timer doesn't go below 0.
    }
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        currentQuestionIndex++; // Advancing to the next question.
        setNextQuestion(); // Setting up the next question.
    } else {
        endGame(); // Ending the game if there are no more questions.
    }
}

// This function defines the end of the game.
function endGame() {
    clearInterval(timerInterval); // Stopping the timer.
    questionContainerElement.classList.add('hide'); // Hiding the question container.
    resultContainerElement.classList.remove('hide'); // Showing the results container.
    const finalScore = correctAnswers + quizTimer; // Calculating the final score.

    // This is where I save the final score for display.
    const finalScoreElement = document.getElementById('final-score');
    finalScoreElement.textContent = finalScore + "! This was "; // Displaying the score with additional text.

    quizActive = false; // Indicating that the quiz is no longer active.
}

// This function defines the behavior when the save score button is clicked.
saveScoreButton.addEventListener('click', () => {
    if (firstClick) {
        const initials = initialsInput.value.trim(); // Getting the player's initials and trimming whitespace.

        // This is where I check if the initials field is empty.
        if (!initials) {
            alert("Please enter your initials before saving your score."); // Alerting the user.
            return; // Exiting early if initials are empty.
        }

        // This is where I save the score and initials to local storage.
        const score = correctAnswers + quizTimer;
        const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
        const newScore = { score, initials };
        highScores.push(newScore);
        highScores.sort((a, b) => b.score - a.score);
        localStorage.setItem('highScores', JSON.stringify(highScores));
        displayHighScores(); // Displaying the high scores.

        // Changing the button text and state for the play again functionality.
        saveScoreButton.textContent = 'Play Again?';
        firstClick = false;
    } else {
        // This is where the game is reset to start over.
        resetGame();
    }
});

// This function resets the game to its initial state.
function resetGame() {
    // Resetting all relevant variables and UI elements.
    quizTimer = 60;
    correctAnswers = 0;
    firstClick = true;
    currentQuestionIndex = 0;
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);

    // Resetting UI elements to their initial state.
    saveScoreButton.textContent = 'Save';
    finalScoreElement.textContent = '';
    questionContainerElement.classList.add('hide');
    resultContainerElement.classList.add('hide');
    highScoresElement.classList.add('hide');
    startButton.classList.remove('hide');
    timerElement.textContent = "Time: " + quizTimer;  // Resetting the timer display.

    resetState(); // Resetting the state of the answer buttons.
}

// This function displays the high scores.
function displayHighScores() {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

    // Clearing any existing content in the score list.
    scoreList.innerHTML = '';

    // Adding the current high scores to the list.
    highScores.forEach(scoreItem => {
        const scoreEntry = document.createElement('li');
        scoreEntry.textContent = `${scoreItem.initials} - ${scoreItem.score}`;
        scoreList.appendChild(scoreEntry);
    });

    // Making sure the high scores element is visible.
    highScoresElement.classList.remove('hide');
}

// This function clears the high scores from local storage.
clearScoresButton.addEventListener('click', () => {
    localStorage.removeItem('highScores'); // Removing high scores from local storage.
    displayHighScores(); // Refreshing the displayed scores.
});

// Questions here
const questions = [
    {
        question: 'What does HTML stand for?',
        answers: [
            { text: 'HyperText Markup Language', correct: true },
            { text: 'HighText Machine Language', correct: false },
            { text: 'Hyperlinking Text Markup Language', correct: false },
            { text: 'HyperTool Markup Language', correct: false }
        ]
    },
    {
        question: 'What does CSS stand for?',
        answers: [
            { text: 'Computing Style Sheet', correct: false },
            { text: 'Creative Style System', correct: false },
            { text: 'Cascading Style Sheets', correct: true },
            { text: 'Colorful Style Sheets', correct: false }
        ]
    },
    {
        question: 'Which HTML tag is used to define an internal style sheet?',
        answers: [
            { text: '<script>', correct: false },
            { text: '<css>', correct: false },
            { text: '<style>', correct: true },
            { text: '<link>', correct: false }
        ]
    },
    {
        question: 'Which of the following is a JavaScript framework?',
        answers: [
            { text: 'Python', correct: false },
            { text: 'Django', correct: false },
            { text: 'React', correct: true },
            { text: 'Flask', correct: false }
        ]
    },
    {
        question: 'What HTML element is used for the largest heading?',
        answers: [
            { text: '<heading>', correct: false },
            { text: '<h6>', correct: false },
            { text: '<h1>', correct: true },
            { text: '<head>', correct: false }
        ]
    },
    {
        question: 'What property is used to change the text color of an element?',
        answers: [
            { text: 'fontcolor', correct: false },
            { text: 'text-color', correct: false },
            { text: 'color', correct: true },
            { text: 'background-color', correct: false }
        ]
    },
    {
        question: 'Which of these is a valid way to declare a JavaScript variable?',
        answers: [
            { text: 'variable carName;', correct: false },
            { text: 'v carName;', correct: false },
            { text: 'var carName;', correct: true },
            { text: 'int carName;', correct: false }
        ]
    },
    {
        question: 'Which tag is used to specify an image in HTML?',
        answers: [
            { text: '<img>', correct: true },
            { text: '<image>', correct: false },
            { text: '<src>', correct: false },
            { text: '<pic>', correct: false }
        ]
    },
    {
        question: 'What is the purpose of the alt attribute in images?',
        answers: [
            { text: 'To provide an alternative text', correct: true },
            { text: 'To make the image load faster', correct: false },
            { text: 'To align the image', correct: false },
            { text: 'To make the image larger', correct: false }
        ]
    },
    {
        question: 'What does "www" stand for in a website browser?',
        answers: [
            { text: 'World Wide Web', correct: true },
            { text: 'Wild Wild West', correct: false },
            { text: 'Web Wide World', correct: false },
            { text: 'World Web Wide', correct: false }
        ]
    }
];

