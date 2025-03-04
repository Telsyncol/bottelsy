require('dotenv').config();  // Cargar las variables de entorno del archivo .env
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

app.post('/chat', async (req, res) => {
    const { userMessage } = req.body;

    if (!userMessage) {
        return res.status(400).send("Se requiere un mensaje.");
    }

    try {
        // Hacer la solicitud a OpenAI usando la clave del entorno
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Usar la clave de API desde las variables de entorno
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: userMessage }]
            })
        });

        const data = await response.json();
        const botMessage = data.choices[0].message.content;
        res.json({ botMessage });
    } catch (error) {
        console.error("Error al comunicarse con OpenAI:", error);
        res.status(500).send("Hubo un error al comunicarse con OpenAI.");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
