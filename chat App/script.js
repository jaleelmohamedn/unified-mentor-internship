const socket = io();

const username = localStorage.getItem("username");
const room = localStorage.getItem("room");

if (!username || !room) {
  window.location.href = "index.html";
}

document.getElementById("roomTitle").textContent = `Room: ${room}`;

socket.emit("joinRoom", { username, room });

const chatBox = document.getElementById("chatBox");
const form = document.getElementById("messageForm");
const input = document.getElementById("messageInput");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (message) {
    socket.emit("chatMessage", message);
    input.value = "";
  }
});

socket.on("message", (data) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<strong>${data.username}</strong>: ${formatText(data.text)} <div class="timestamp">${data.time}</div>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
});

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
    .replace(/\*(.*?)\*/g, "<i>$1</i>")
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
}
