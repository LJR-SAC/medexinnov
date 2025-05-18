const chatLog = document.getElementById("chat-log");
const form = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");



form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const texto = userInput.value.trim();
  if (!texto) return;


  appendMessage("🧑 Usuario", texto);
  userInput.value = "";

  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("message");
  loadingDiv.id = "loading-message";
  loadingDiv.innerHTML = `
    <strong>👨‍⚕️ MedExpress:</strong> 
    <span class="loading-indicator">
      <span class="dot"></span><span class="dot"></span><span class="dot"></span> Procesando...
    </span>`;
  chatLog.appendChild(loadingDiv);
  chatLog.scrollTop = chatLog.scrollHeight;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: texto, sessionId: "usuario123" })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      const content = data.choices[0].message.content.trim();
      appendMessage("👨‍⚕️ MedExpress", content);
    } else {
      appendMessage("❗Error", "La respuesta del servidor fue vacía.");
    }
  } catch (error) {
    console.error("Error al conectar con el servidor:", error);
    appendMessage("❌ Error", "Hubo un problema al contactar con el servidor.");
  } finally {
    const loadingMsg = document.getElementById("loading-message");
    if (loadingMsg) loadingMsg.remove();
  }
});

function appendMessage(sender, message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}
