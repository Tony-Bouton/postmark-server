require('dotenv').config();
const express = require('express');
const cors = require('cors');
const postmark = require('postmark');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Autoriser les requêtes du frontend
app.use(express.json()); // Permet de traiter le JSON dans les requêtes
const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
// ✅ Route GET pour tester si le serveur fonctionne
app.get("/", (req, res) => {
    res.send("Le serveur Postmark fonctionne 🚀");
});

// ✅ Route POST pour envoyer un e-mail
app.post('/send-email', async (req, res) => {
    const {name, mail, message } = req.body;
console.log(req.body)
if (!name || !mail || !message) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }
    const validateForm = () => {
        const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/;
        const mailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const htmlRegex = /^(?!.*<[^>]+>).+$/;

        if (!nameRegex.test(form.name)) {
            alert("Le nom ne doit contenir que des lettres, espaces et tirets.");
            return false;
        }
        if (!mailRegex.test(form.mail)) {
            alert("L'email n'est pas valide.");
            return false;
        }
        if (!htmlRegex.test(form.message)) {
            alert("Le message ne doit pas contenir de HTML.");
            return false;
        }
        return true;
    };
    if (!validateForm) {
        return res.status(400).json({ error: "Tous les champs ne sont pas conforme" });
    }
    try {
        await client.sendEmail({
                From: process.env.EMAIL_FROM,
                To: process.env.EMAIL_FROM,
                Subject: `Demande de projet de ${req.body.name}`,
                HtmlBody: `<p>ce message est envoyer par :${req.body.mail}</p><p>${req.body.message}</p>`,
                TextBody: `de ${req.body.message}`,
                MessageStream: "outbound"
        });
        
        res.status(200).json({ message: "Email et confirmation envoyés avec succès" });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de l'envoi de l'email", details: error.message });
    }
});

// Lancer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
