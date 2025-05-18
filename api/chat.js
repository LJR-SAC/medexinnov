
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const {message, sessionId = "default"} = req.body;
  if (!message) {
    return res.status(400).json({ error: "Falta el mensaje del usuario" });
  }

  if (!global.sessions) {
    global.sessions = new Map(): 
  }
  if (!global.sessions.has(sessionId)){
    global.sessions.set(sessionId, [
      {
        role: "system",
        content: "Eres una herramienta de primera consulta al contraer cualquier enfermedad, adopta un tono tranquilo y conciso, se debe recomendar siempre la búsqueda de atención médica e indicar a qué tipo de especialista visitar, hablas en español e indicas basándote en los síntomas: urgencia y tipo de especialista a visitar, qué tomar en el momento (como primera opción medicina natural y como segunda medicamentos de venta libre) y la posible enfermedad que posea. Remarcar la importancia de visitar al médico ya que esta no es información experta. Resume todo para que sea amigable y no utilices términos complejos. Utiliza emojis para hacer más amigable el ambiente."
      }
      ]);
  }

  const history = sessions.get(sessionId);
  history.push({ role: "user", content: message });


  try {
    const completion = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: chatHistory,
        temperature: 0.7
      
      })
    });
    

    const data = await response.json();
    const reply=data.choices[0].message;
    chat.History.push(reply);
    res.status(200).json({choices: [reply]});
  } catch (error) {
    console.error("Error en OpenRouter:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
}
