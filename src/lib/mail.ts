import nodemailer from 'nodemailer';

// Configuración del transportador de correo
export const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVER_SERVICE,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

// Función para enviar correos de bienvenida
export async function sendWelcomeEmail(to: string, name: string, userType: string) {
  try {
    const info = await transporter.sendMail({
      from: `"Maestro Chasquilla" <${process.env.EMAIL_FROM}>`,
      to,
      subject: '¡Bienvenido a Maestro Chasquilla!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #f97316;">¡Hola, ${name}!</h2>
          <p>Tu cuenta en Maestro Chasquilla ha sido creada exitosamente como <strong>${userType}</strong>.</p>
          <p>Ahora puedes acceder a todas las funcionalidades de nuestra plataforma:</p>
          
          ${userType === "proveedor de servicios" 
            ? `<ul>
                <li>Crea y gestiona tus servicios</li>
                <li>Recibe solicitudes de clientes</li>
                <li>Comunícate con clientes potenciales</li>
                <li>Administra tu agenda y disponibilidad</li>
              </ul>` 
            : `<ul>
                <li>Explora servicios disponibles</li>
                <li>Solicita presupuestos</li>
                <li>Comunícate con proveedores</li>
                <li>Deja reseñas sobre los servicios recibidos</li>
              </ul>`
          }
          
          <p>Si tienes alguna pregunta, no dudes en contactar a nuestro equipo de soporte.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="font-size: 14px; color: #666;">Saludos,<br>El equipo de Maestro Chasquilla</p>
          </div>
        </div>
      `
    });

    console.log('Correo enviado correctamente:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return false;
  }
}