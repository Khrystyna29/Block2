// script.js

// Отримання елементів DOM
const testContainer = document.getElementById('test-container');
const resultContainer = document.getElementById('result');
const checkButton = document.getElementById('check-btn');

// Отримання JSON даних
fetch('package.json')
  .then(response => response.json())
  .then(questionsJSON => {
    // Генерація тесту з JSON
    generateTest(questionsJSON);

    // Обробник кнопки "Перевірити"
    checkButton.addEventListener('click', () => {
      let correctAnswers = 0;
      questionsJSON.questions.forEach((question, index) => {
        const selectedAnswer = document.querySelector(`input[name="question${index}"]:checked`);
        if (selectedAnswer) {
          if (selectedAnswer.value === 'true') {
            correctAnswers++;
          } else {
            const wrongAnswer = selectedAnswer.nextElementSibling;
            wrongAnswer.classList.add('wrong-answer');
          }
        }
      });
      resultContainer.textContent = `Результат: ${correctAnswers}/${questionsJSON.questions.length}`;
    });
  })
  .catch(error => console.error('Error fetching JSON:', error));

// Генерація тесту з JSON
function generateTest(questionsJSON) {
  let html = '';
  questionsJSON.questions.forEach((question, index) => {
    html += `<div class="question">${index + 1}. ${question.question}</div>`;
    question.answers.forEach((answer, answerIndex) => {
      html += `
        <div class="answer">
          <input type="radio" name="question${index}" id="q${index}a${answerIndex}" value="${answer.isCorrect}">
          <label for="q${index}a${answerIndex}">${answer.answer}</label>
        </div>
      `;
    });
  });
  testContainer.innerHTML = html;
}
