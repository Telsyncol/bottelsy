const express = require('express');
const fetch = require('node-fetch'); // Para hacer solicitudes HTTP
const app = express();

// Parsear JSON
app.use(express.json());

// Ruta para recibir mensajes del frontend
app.post('/chat', async (req, res) => {
    const { userMessage } = req.body; // El mensaje del usuario

    if (!userMessage) {
        return res.status(400).send("Se requiere un mensaje.");
    }

    try {
        // Llamada a OpenAI
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Usando la clave de API desde las variables de entorno
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: userMessage }]
            })
        });

        const data = await response.json();
        const botMessage = data.choices[0].message.content;
        res.json({ botMessage }); // Responder al frontend con el mensaje del bot
    } catch (error) {
        console.error("Error al comunicarse con OpenAI:", error);
        res.status(500).send("Hubo un error al comunicarse con OpenAI.");
    }
});

// Escuchar en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
