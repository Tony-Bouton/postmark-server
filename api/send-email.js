// server.js
import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "****" : "null");
console.log("EMAIL_TO:", process.env.EMAIL_TO);
const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/send-email", async (req, res) => {
    const { name, mail, message } = req.body;

    if (!name || !mail || !message) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }
    console.log(process.env.SMTP_USER)
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.hostinger.com",   // ✅ serveur sortant Hostinger
            port: 465,                     // ✅ port SSL
            secure: true,                  // SSL
            auth: {
                user: process.env.SMTP_USER, // ton email Hostinger complet
                pass: process.env.SMTP_PASS, // mot de passe SMTP
            },
        });

        await transporter.sendMail({
            from: 'contact@pandaru.fr',           // l'expéditeur peut être l'utilisateur
            to: 'contact@pandaru.fr',              // email qui reçoit
            subject: `Nouveau message de ${name} : ${mail}`,
            text: message,
        });

        res.status(200).json({ message: "Email envoyé avec succès" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur", details: err.message });
    }
});

app.get("/", (req, res) => res.send("Serveur API Mail Hostinger OK 🚀"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
