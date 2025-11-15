import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors()); // autorise le front local
app.use(express.json());

// Route GET pour tester le serveur
app.get("/", (req, res) => {
    res.send("🚀 Serveur Mail en ligne !");
});

app.post("/send-email", async (req, res) => {
    const { name, mail, message } = req.body;

    if (!name || !mail || !message) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
        });

        await transporter.sendMail({
            from: `"${name}" <${mail}>`,
            to: process.env.EMAIL_TO,
            subject: `Nouveau message de ${name}`,
            text: message,
            html: `<p>${message}</p><p>De : ${mail}</p>`
        });

        res.json({ message: "Email envoyé avec succès" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur", details: err.message });
    }
});

app.listen(3000, () => console.log("API Mail running on http://localhost:3000"));
