import nodemailer from 'nodemailer';

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org',
    port: 587,
    auth: {
      user: process.env.MAILGUN_USER,
      pass: process.env.MAILGUN_PASS
    }
  });

  const { name, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'info@dynecron.com',
    subject: 'Nuevo Mensaje del Formulario de Contacto',
    text: `Mensaje de ${name} (${email}): ${message}`,
    html: `<b>Mensaje de ${name} (${email}):</b> <p>${message}</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email enviado correctamente" });
  } catch (error) {
    console.error("Error al enviar email:", error);
    res.status(500).json({ error: "Error al enviar el email" });
  }
};
