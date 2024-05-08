let currentQuestionIndex = 0;
let score = 0;
let answeredQuestions = {};
let filteredQuestions = [];

// Function to load JSON file
function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'questions.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == 200) {
            callback(JSON.parse(xobj.responseText));
        }
    };
    xobj.send(null);
}

// Function to reset quiz
function reset() {
    score = 0;
    document.getElementById('quiz-container').style.display = 'none';
}

// Function to start quiz
function startQuiz() {
    score = 0;
    loadJSON(function (data) {
        const selectedTopic = document.getElementById('topic').value;
        const selectedDifficulty = document.getElementById('difficulty').value;

        filteredQuestions = data.questions.filter(question =>
            question.topic === selectedTopic && question.difficulty === selectedDifficulty
        );

        if (filteredQuestions.length === 0) {
            alert('No questions available for the selected topic and difficulty.');
            return;
        }

        filteredQuestions = selectRandomQuestions(5);

        document.getElementById('quiz-container').style.display = 'block';

        currentQuestionIndex = 0;
        score = 0;
        answeredQuestions = {};
        displayQuestion(filteredQuestions[currentQuestionIndex]);
    });
}

// Function to select random questions
function selectRandomQuestions(numQuestions) {
    const shuffledQuestions = filteredQuestions.sort(() => Math.random() - 0.5);
    return shuffledQuestions.slice(0, numQuestions);
}

// Function to display question
function displayQuestion(question) {
    const questionElement = document.getElementById('question');
    questionElement.textContent = question.text;

    const optionsElement = document.getElementById('options');
    optionsElement.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionButton = document.createElement('button');
        optionButton.textContent = option;
        optionButton.onclick = () => evaluateAnswer(index, question.correct_answer);
        optionsElement.appendChild(optionButton);
    });

    document.getElementById('quiz-container').style.display = 'block';
}

// Function to evaluate answer
// Function to evaluate answer
function evaluateAnswer(selectedIndex, correctIndex) {
  if (answeredQuestions[currentQuestionIndex]) {
      return;
  }

  const isCorrect = selectedIndex === correctIndex;

  if (isCorrect) {
      score++;
      document.getElementById('quiz-container').classList.add('correct-answer');
  } else {
      document.getElementById('quiz-container').classList.add('wrong-answer');
  }

  answeredQuestions[currentQuestionIndex] = true;

  setTimeout(() => {
      document.getElementById('quiz-container').classList.remove('correct-answer', 'wrong-answer');
      if (currentQuestionIndex === filteredQuestions.length - 1) {
          showScore();
          return;
      }
      nextQuestion();
  }, 1000);
}


// Function to move to the next question
function nextQuestion() {
    currentQuestionIndex++;
    displayQuestion(filteredQuestions[currentQuestionIndex]);
}

// Function to display final score
function showScore() {
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = `Your score: ${score}/${filteredQuestions.length}`;
}
