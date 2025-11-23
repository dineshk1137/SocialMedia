const chatSocket = io();

const msgInput = document.getElementById("messageInput");
const messages = document.getElementById("messages");
const sendBtn = document.getElementById("sendButton");

// Join chat room
chatSocket.emit("joinChat", { chatId: CHAT_ID, userId: USER_ID });

sendBtn.addEventListener("click", () => {
    const content = msgInput.value.trim();
    if (!content) return;

    chatSocket.emit("sendMessage", {
        chatId: CHAT_ID,
        userId: USER_ID,
        content
    });

    msgInput.value = "";
});

// Receive and display new message with timestamp
chatSocket.on("newMessage", (msg) => {
    const messagesDiv = document.getElementById("messages");

    const div = document.createElement("div");

    const isMine = msg.senderId === USER_ID;

    div.classList.add("msg", isMine ? "msg-user" : "msg-other");

    // Format time
    const time = new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    div.innerHTML = `
        <strong>${msg.sender}</strong>
        <span class="timestamp">${time}</span>
        <br>
        ${msg.content}
    `;

    messagesDiv.appendChild(div);

    // Auto-scroll to bottom
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
