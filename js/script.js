document.addEventListener('DOMContentLoaded', () => {
    const questionElem = document.getElementById('question');
    const userAnswer = document.getElementById('user-answer');
    const message = document.getElementById('message');
    const submitBtn = document.getElementById('submit-btn');
    const helpBtn = document.getElementById('help-btn');
    const hintBtn = document.getElementById('hint-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const scoreElem = document.getElementById('score');
    const loading = document.querySelector('.loading');
    const content = document.querySelector('.content');

    let questions = [];
    let currentQuestionIndex = 0;
    let questionAnswered = {}; 
    let userScore = 0;

    function loadQuestion(index) {
        if (index >= 0 && index < questions.length) {
            questionElem.textContent = questions[index].question;
            userAnswer.value = '';
            message.textContent = '';
            // Show/hide Previous button
            prevBtn.style.display = index > 0 ? 'inline-block' : 'none';
            // Determine whether to show Next button
            if (index in questionAnswered && questionAnswered[index]) {
                nextBtn.style.display = index < questions.length - 1 ? 'inline-block' : 'none';
            } else {
                nextBtn.style.display = 'none';
            }
        }
    }

    function updateScore() {
        scoreElem.textContent = `Score: ${userScore}`;
    }

    function fetchQuestions() {
        fetch('questions.json')
            .then(response => response.json())
            .then(data => {
                questions = data;
                loadQuestion(currentQuestionIndex);
                content.style.display = 'block';
                loading.style.display = 'none';
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
                message.textContent = "Error loading questions.";
                message.style.color = "red";
                content.style.display = 'none';
                loading.style.display = 'none';
            });
    }

    submitBtn.addEventListener('click', () => {
        const currentQuestion = questions[currentQuestionIndex];
        if (userAnswer.value.trim().toLowerCase() === currentQuestion.answer.toLowerCase()) {
            message.textContent = "The answer is right!";
            message.style.color = "green";
            // Mark the current question as answered
            questionAnswered[currentQuestionIndex] = true;
            userScore++;
            updateScore();
            // Show Next button if not the last question
            if (currentQuestionIndex < questions.length - 1) {
                nextBtn.style.display = 'inline-block';
            }
        } else {
            message.textContent = "The answer is incorrect. Try again.";
            message.style.color = "red";
            // Hide Next button on incorrect answer
            nextBtn.style.display = 'none';
        }
    });

    helpBtn.addEventListener('click', () => {
        window.location.href = `help.html?index=${currentQuestionIndex}`;
    });

    hintBtn.addEventListener('click', () => {
        message.textContent = `Hint: ${questions[currentQuestionIndex].answer}`;
        message.style.color = "blue";
        setTimeout(() => {
            message.textContent = "";
        }, 3000);
    });

    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            loadQuestion(currentQuestionIndex);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            loadQuestion(currentQuestionIndex);
        }
    });

    // Show loading animation while fetching questions
    fetchQuestions();
});
