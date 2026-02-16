let boxes = document.querySelectorAll(".box");
let reset = document.querySelector("#reset");

// Popup container
let messageContainer = document.createElement("div");
document.body.appendChild(messageContainer);

let turnO = true; // O starts

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

messageContainer.id = "popup";
Object.assign(messageContainer.style, {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%) scale(0)",
  padding: "30px 50px",
  borderRadius: "15px",
  background: "linear-gradient(135deg, #ff00cc, #ffcc00, #00ffff)",
  color: "#fff",
  fontSize: "1.5rem",
  fontWeight: "bold",
  textAlign: "center",
  boxShadow: "0 0 30px rgba(255,255,255,0.7)",
  transition: "transform 0.3s ease",
  zIndex: "1000",
  display: "none",
});

// helper for async waits
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

boxes.forEach((box) => {
  box.addEventListener("click", async () => {
    if (turnO) {
      box.innerText = "O";
      box.style.color = "#00ffff";
      turnO = false;
    } else {
      box.innerText = "X";
      box.style.color = "#ff00cc";
      turnO = true;
    }
    box.disabled = true;
    await checkWinner();
  });
});

const checkWinner = async () => {
  for (let pattern of winPatterns) {
    let [a, b, c] = pattern.map((i) => boxes[i].innerText);
    if (a && a === b && b === c) {
      highlightWinner(pattern);
      await showPopup(`${a} Wins 🎉`);
      return;
    }
  }
  if ([...boxes].every((box) => box.innerText)) {
    await showPopup("It's a Draw 🤝");
  }
};

const highlightWinner = (pattern) => {
  pattern.forEach((i) => boxes[i].classList.add("win"));
};

const showPopup = async (message) => {
  messageContainer.innerText = message;
  messageContainer.style.display = "block";
  await sleep(50);
  messageContainer.style.transform = "translate(-50%, -50%) scale(1)";
  boxes.forEach((b) => (b.disabled = true));
  await sleep(2500);
  messageContainer.style.transform = "translate(-50%, -50%) scale(0)";
  await sleep(300);
  messageContainer.style.display = "none";
};

reset.addEventListener("click", () => {
  boxes.forEach((box) => {
    box.innerText = "";
    box.disabled = false;
    box.classList.remove("win");
  });
  turnO = true;
  messageContainer.style.display = "none";
});
