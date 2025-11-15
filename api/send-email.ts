// /api/send-email.js
import { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // ⚡ CORS pour permettre les requêtes depuis ton front-end
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Répondre aux preflight requests
    if (req.method === 'OPTIONS') return res.status(200).end();

    // Vérification méthode
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    const { name, mail, message } = req.body;

    // Validation simple
    if (!name || !mail || !message) {
        return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    try {
        // Créer le transport SMTP
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,     // ex: smtp.hostinger.com
            port: parseInt(process.env.SMTP_PORT || '587'), // 465 pour SSL, 587 pour TLS
            secure: process.env.SMTP_SECURE === 'true', // true pour 465
            auth: {
                user: process.env.SMTP_USER,   // ton email
                pass: process.env.SMTP_PASS,   // mot de passe ou app password
            },
        });

        // Envoyer l'email
        await transporter.sendMail({
            from: `"${name}" <${mail}>`,
            to: process.env.EMAIL_TO,          // ex: contact@pandaru.fr
            subject: `Demande de projet de ${name}`,
            text: message,
            html: `<p>${message}</p><p>De : ${mail}</p>`,
        });

        return res.status(200).json({ message: 'Email envoyé avec succès' });
    } catch (err: any) {
        console.error('Erreur SMTP:', err);
        return res.status(500).json({ error: 'Erreur serveur', details: err.message });
    }
}
