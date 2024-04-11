// SUMMARY: This script retrieves the current score from localStorage, updates the list of high scores,
// displays the top 3 high scores in the designated div, and highlights the new high score temporarily.
const currentScore = parseInt(localStorage.getItem("score")) || 0;
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];

highScores.push(currentScore);
highScores.sort((a, b) => b - a);
highScores = highScores.slice(0, 3);
localStorage.setItem("highScores", JSON.stringify(highScores));

const highScoreDiv = document.getElementById("high-score");
if (highScoreDiv) {
  highScoreDiv.innerHTML = "<h2>Top 3 High Scores</h2>";
  const ul = document.createElement("ul");
  highScores.forEach((score, index) => {
    const li = document.createElement("li");
    li.textContent = score;
    ul.appendChild(li);

    if (score === currentScore) {
      li.classList.add("new-high-score");
      setTimeout(() => {
        li.classList.remove("new-high-score");
      }, 3000);
    }
  });
  highScoreDiv.appendChild(ul);

  const listItems = ul.querySelectorAll("li");
  listItems.forEach((item) => {
    item.classList.add("high-score-item");
  });
} else {
  console.error("No High Score");
}
