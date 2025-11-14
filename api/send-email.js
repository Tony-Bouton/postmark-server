import postmark from "postmark";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { name, mail, message } = req.body;

  // Validation minimale
  if (!name || !mail || !message) {
    return res.status(400).json({ error: "Tous les champs sont requis" });
  }

  const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

  try {
    await client.sendEmail({
      From: process.env.EMAIL_FROM,
      To: process.env.EMAIL_FROM,
      Subject: `Demande de projet de ${name}`,
      HtmlBody: `
        <p>Message envoyé par : <b>${mail}</b></p>
        <p>${message}</p>
      `,
      TextBody: `${message}`,
      MessageStream: "outbound"
    });

    return res.status(200).json({ message: "Email envoyé avec succès" });

  } catch (err) {
    return res.status(500).json({ error: "Erreur Postmark", details: err.message });
  }
}
