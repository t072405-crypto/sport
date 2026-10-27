const $ = (id) => document.getElementById(id);
const screens = { start: $("start"), game: $("game"), end: $("end") };

let order, index, score, answered;

function show(name) {
  for (const [key, el] of Object.entries(screens)) el.classList.toggle("hidden", key !== name);
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function startGame() {
  order = shuffle(QUESTIONS);
  index = 0;
  score = 0;
  show("game");
  showQuestion();
}

function showQuestion() {
  const item = order[index];
  answered = false;
  $("progress").textContent = `Question ${index + 1} / ${order.length}`;
  $("score").textContent = `Score: ${score}`;
  $("question").textContent = item.q;
  $("nextBtn").classList.add("hidden");

  const box = $("answers");
  box.innerHTML = "";
  item.a.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.className = "answer";
    btn.textContent = text;
    btn.addEventListener("click", () => choose(i, btn));
    box.appendChild(btn);
  });
}

function choose(i, btn) {
  if (answered) return;
  answered = true;
  const item = order[index];
  const buttons = [...$("answers").children];
  buttons[item.correct].classList.add("correct");
  if (i === item.correct) {
    score++;
  } else {
    btn.classList.add("wrong");
  }
  $("score").textContent = `Score: ${score}`;
  $("nextBtn").textContent = index === order.length - 1 ? "Finish" : "Next";
  $("nextBtn").classList.remove("hidden");
}

function next() {
  index++;
  if (index >= order.length) {
    $("result").textContent = `You scored ${score} out of ${order.length}.`;
    show("end");
  } else {
    showQuestion();
  }
}

$("startBtn").addEventListener("click", startGame);
$("restartBtn").addEventListener("click", startGame);
$("nextBtn").addEventListener("click", next);
