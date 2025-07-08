import nodemailer from 'nodemailer';


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
      from: `"Red Maestro" <${process.env.EMAIL_FROM}>`,
      to,
      subject: '¡Bienvenido a Red Maestro! 🛠️',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 25px;">
            <img src="https://res.cloudinary.com/dil83zjxy/image/upload/v1750661412/maestro-chasquilla/profiles/ud45ed86grzvdp3bcpg5.png" alt="Red Maestro" style="max-width: 180px; height: auto;" />
          </div>
          <div style="background-color: #fff4eb; border-left: 4px solid #f97316; padding: 15px 20px; margin-bottom: 25px; border-radius: 6px;">
            <h2 style="color: #f97316; margin-top: 0; font-size: 24px; font-weight: 600;">¡Bienvenido(a) a bordo, ${name}! 🎉</h2>
            <p style="color: #4b5563; font-size: 16px; margin-bottom: 0;">
              Tu cuenta ha sido creada exitosamente como <strong style="color: #f97316; font-weight: 600;">${userType}</strong>.
            </p>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #374151; margin-top: 0; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
              <span style="margin-right: 8px; color: #f97316;">✨</span> Lo que puedes hacer ahora:
            </h3>
            
            ${userType === "proveedor de servicios" 
              ? `<ul style="color: #4b5563; padding-left: 15px; list-style-type: none;">
                  <li style="margin-bottom: 12px; position: relative; padding-left: 25px;">
                    <span style="position: absolute; left: 0; color: #f97316;">✅</span> 
                    <strong>Crea y gestiona tus servicios</strong> - Muestra tus habilidades al mundo
                  </li>
                  <li style="margin-bottom: 12px; position: relative; padding-left: 25px;">
                    <span style="position: absolute; left: 0; color: #f97316;">✅</span> 
                    <strong>Recibe solicitudes de clientes</strong> - Expande tu cartera de clientes
                  </li>
                  <li style="margin-bottom: 12px; position: relative; padding-left: 25px;">
                    <span style="position: absolute; left: 0; color: #f97316;">✅</span> 
                    <strong>Comunícate con clientes potenciales</strong> - Construye relaciones duraderas
                  </li>
                  <li style="margin-bottom: 12px; position: relative; padding-left: 25px;">
                    <span style="position: absolute; left: 0; color: #f97316;">✅</span> 
                    <strong>Administra tu agenda y disponibilidad</strong> - Organiza tu trabajo eficientemente
                  </li>
                </ul>` 
              : `<ul style="color: #4b5563; padding-left: 15px; list-style-type: none;">
                  <li style="margin-bottom: 12px; position: relative; padding-left: 25px;">
                    <span style="position: absolute; left: 0; color: #f97316;">✅</span> 
                    <strong>Explora servicios disponibles</strong> - Encuentra la ayuda que necesitas
                  </li>
                  <li style="margin-bottom: 12px; position: relative; padding-left: 25px;">
                    <span style="position: absolute; left: 0; color: #f97316;">✅</span> 
                    <strong>Solicita presupuestos</strong> - Compara opciones y precios
                  </li>
                  <li style="margin-bottom: 12px; position: relative; padding-left: 25px;">
                    <span style="position: absolute; left: 0; color: #f97316;">✅</span> 
                    <strong>Comunícate con proveedores</strong> - Resuelve todas tus dudas
                  </li>
                  <li style="margin-bottom: 12px; position: relative; padding-left: 25px;">
                    <span style="position: absolute; left: 0; color: #f97316;">✅</span> 
                    <strong>Deja reseñas sobre los servicios</strong> - Ayuda a otros usuarios
                  </li>
                </ul>`
            }
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" 
               style="background-color: #f97316; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; transition: background-color 0.3s ease;">
               Comenzar ahora
            </a>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 25px 0 20px;">
            <p style="color: #4b5563; font-size: 15px; line-height: 1.5; margin: 0;">
              <strong>¿Necesitas ayuda?</strong> Si tienes alguna pregunta, no dudes en contactar a nuestro 
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/contacto" style="color: #f97316; text-decoration: none; font-weight: 500;">equipo de soporte</a>.
            </p>
          </div>
          
          <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 15px;">
              ¡Gracias por unirte a nuestra comunidad!<br>
              <strong style="color: #f97316;">El equipo de Red Maestro</strong>
            </p>
            
            <div style="margin-top: 15px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/terms" style="color: #6b7280; text-decoration: none; font-size: 12px; margin: 0 10px;">Términos y Condiciones</a>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color: #6b7280; text-decoration: none; font-size: 12px; margin: 0 10px;">Política de Privacidad</a>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" style="color: #6b7280; text-decoration: none; font-size: 12px; margin: 0 10px;">Centro de Ayuda</a>
            </div>
            
            <div style="margin-top: 20px;">
              <span style="color: #9ca3af; font-size: 12px;">© ${new Date().getFullYear()} Red Maestro. Todos los derechos reservados.</span>
            </div>
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


// Función para enviar correos de aceptación de servicio
export async function sendServiceAcceptedEmail(
  to: string,
  userName: string,
  providerName: string,
  serviceName: string,
  providerId: string
) {
  try {
    const info = await transporter.sendMail({
      from: `"Red Maestro" <${process.env.EMAIL_FROM}>`,
      to,
      subject: '¡Tu solicitud de servicio ha sido aceptada! 🎉',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://res.cloudinary.com/dil83zjxy/image/upload/v1750661412/maestro-chasquilla/profiles/ud45ed86grzvdp3bcpg5.png" alt="Red Maestro" style="max-width: 150px; height: auto;" />
          </div>
          
          <div style="background-color: #fff4eb; border-left: 4px solid #f97316; padding: 15px; margin-bottom: 25px;">
            <h2 style="color: #f97316; margin-top: 0; font-size: 22px;">¡Excelentes noticias, ${userName}! 🙌</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 0;">
              Tu solicitud de servicio ha sido <strong style="color: #f97316;">ACEPTADA</strong>
            </p>
          </div>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Nos complace informarte que <strong style="color: #1f2937;">${providerName}</strong> ha confirmado tu solicitud para el servicio de <strong style="color: #1f2937;">${serviceName}</strong>.
          </p>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e5e7eb;">
            <h3 style="color: #4b5563; margin-top: 0; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
              <span style="margin-right: 8px;">📋</span> Próximos pasos:
            </h3>
            <ul style="color: #4b5563; padding-left: 20px; margin-bottom: 0;">
              <li style="margin-bottom: 10px;">El proveedor se pondrá en contacto contigo para coordinar los detalles.</li>
              <li style="margin-bottom: 10px;">Revisa las condiciones del servicio y confirma los detalles con el proveedor.</li>
              <li style="margin-bottom: 10px;">Una vez recibido el servicio, no olvides calificarlo y dejar una reseña.</li>
            </ul>
          </div>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 20px; text-align: center;">
            ¿Tienes preguntas sobre el servicio? ¡No esperes más!
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/services/provider/${providerId}" 
               style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; transition: background-color 0.3s ease;">
               <span style="margin-right: 8px;">💬</span> Contactar al proveedor
            </a>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 30px;">
            <p style="color: #4b5563; font-size: 14px; line-height: 1.5; margin: 0; text-align: center;">
              <strong>¿Problemas con el servicio?</strong><br>
              Si tienes algún inconveniente, puedes reportarlo desde tu panel de usuario.
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
            <p style="font-size: 14px; color: #6b7280;">¡Gracias por confiar en nosotros!<br>El equipo de <strong style="color: #f97316;">Red Maestro</strong></p>
            
            <div style="margin-top: 15px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/terms" style="color: #6b7280; text-decoration: none; font-size: 12px; margin: 0 10px;">Términos y Condiciones</a>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color: #6b7280; text-decoration: none; font-size: 12px; margin: 0 10px;">Política de Privacidad</a>
            </div>
          </div>
        </div>
      `
    });

    console.log('Correo de aceptación enviado correctamente:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error al enviar el correo de aceptación:', error);
    return false;
  }
}


export async function sendServiceCancelledEmail(
  to: string,
  userName: string,
  serviceName: string,
  providerName: string,
  cancelReason: string,
  cancelledBy: string,
) {
  try {
    const info = await transporter.sendMail({
      from: `"Red Maestro" <${process.env.EMAIL_FROM}>`,
      to,
      subject: 'Información importante sobre tu servicio 📋',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 25px;">
            <img src="https://res.cloudinary.com/dil83zjxy/image/upload/v1750661412/maestro-chasquilla/profiles/ud45ed86grzvdp3bcpg5.png" alt="Red Maestro" style="max-width: 180px; height: auto;" />
          </div>
          
          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px 20px; margin-bottom: 25px; border-radius: 6px;">
            <h2 style="color: #b91c1c; margin-top: 0; font-size: 24px; font-weight: 600;">Servicio cancelado</h2>
            <p style="color: #4b5563; font-size: 16px; margin-bottom: 0;">
              Lamentamos informarte que el servicio solicitado ha sido cancelado.
            </p>
          </div>
          
          <div style="padding: 5px 0 15px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Hola <strong>${userName}</strong>,
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Te informamos que el servicio <strong>"${serviceName}"</strong> con 
              ${cancelledBy === 'provider' ? 'el proveedor' : 'el cliente'} 
              <strong>${providerName}</strong> ha sido cancelado.
            </p>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #374151; margin-top: 0; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">
              <span style="margin-right: 8px; color: #6b7280;">ℹ️</span> Detalles de la cancelación:
            </h3>
            
            <ul style="color: #4b5563; padding-left: 15px;">
              <li style="margin-bottom: 12px;">
                <strong>Servicio:</strong> ${serviceName}
              </li>
              <li style="margin-bottom: 12px;">
                <strong>${cancelledBy === 'provider' ? 'Proveedor' : 'Cliente'}:</strong> ${providerName}
              </li>
              <li style="margin-bottom: 12px;">
                <strong>Cancelado por:</strong> ${cancelledBy === 'provider' ? 'El proveedor del servicio' : 'El cliente'}
              </li>
              <li style="margin-bottom: 12px;">
                <strong>Motivo de cancelación:</strong> ${cancelReason || 'No se proporcionó motivo'}
              </li>
            </ul>
          </div>
          
          <div style="padding: 5px 0 20px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Si consideras que esto ha sido un error o necesitas más información, 
              puedes contactar directamente ${cancelledBy === 'provider' ? 'al proveedor' : 'al cliente'} 
              o a nuestro equipo de soporte.
            </p>
          </div>
          
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 25px 0 20px;">
            <p style="color: #4b5563; font-size: 15px; line-height: 1.5; margin: 0; text-align: center;">
              <strong>¿Buscas otra solución?</strong> Explora más servicios disponibles en nuestra plataforma
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/services" style="color: #f97316; text-decoration: none; font-weight: 500;">haciendo clic aquí</a>.
            </p>
          </div>
          
          <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 15px;">
              Gracias por usar nuestra plataforma.<br>
              <strong style="color: #f97316;">El equipo de Red Maestro</strong>
            </p>
            
            <div style="margin-top: 15px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/terms" style="color: #6b7280; text-decoration: none; font-size: 12px; margin: 0 10px;">Términos y Condiciones</a>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color: #6b7280; text-decoration: none; font-size: 12px; margin: 0 10px;">Política de Privacidad</a>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" style="color: #6b7280; text-decoration: none; font-size: 12px; margin: 0 10px;">Centro de Ayuda</a>
            </div>
            
            <div style="margin-top: 20px;">
              <span style="color: #9ca3af; font-size: 12px;">© ${new Date().getFullYear()} Red Maestro. Todos los derechos reservados.</span>
            </div>
          </div>
        </div>
      `
    });

    console.log('Correo de cancelación enviado correctamente:', info.messageId);
    console.log('enviando correo a:', to);
    return true;
  } catch (error) {
    console.error('Error al enviar el correo de cancelación:', error);
    return false;
  }
}


export async function sendPasswordRecoveryEmail(to: string, name: string, totpCode: string) {
  try {
    const info = await transporter.sendMail({
      from: `"Red Maestro" <${process.env.EMAIL_FROM}>`,
      to,
      subject: 'Código de verificación para recuperar tu contraseña 🔐',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 25px;">
            <img src="https://res.cloudinary.com/dil83zjxy/image/upload/v1750661412/maestro-chasquilla/profiles/ud45ed86grzvdp3bcpg5.png" alt="Red Maestro" style="max-width: 180px; height: auto;" />
          </div>
          
          <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px 20px; margin-bottom: 25px; border-radius: 6px;">
            <h2 style="color: #2563eb; margin-top: 0; font-size: 24px; font-weight: 600;">Recuperación de contraseña 🔒</h2>
            <p style="color: #4b5563; font-size: 16px; margin-bottom: 0;">
              Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.
            </p>
          </div>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hola <strong>${name}</strong>,
          </p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            Para completar el proceso de recuperación de tu contraseña, utiliza el siguiente código de verificación:
          </p>
          
          <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
            <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px;">Tu código de verificación:</h3>
            <div style="background-color: #ffffff; border: 2px solid #2563eb; border-radius: 6px; padding: 20px; display: inline-block; margin: 10px 0;">
              <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px;">
                ${totpCode}
              </span>
            </div>
            <p style="color: #64748b; font-size: 14px; margin: 15px 0 0 0;">
              <strong>⏰ Este código expira en 10 minutos</strong>
            </p>
          </div>
          
          <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 25px 0;">
            <div style="display: flex; align-items: flex-start;">
              <span style="color: #f59e0b; font-size: 18px; margin-right: 10px;">⚠️</span>
              <div>
                <p style="color: #92400e; font-size: 14px; font-weight: 600; margin: 0 0 5px 0;">Importante:</p>
                <ul style="color: #92400e; font-size: 14px; margin: 0; padding-left: 15px;">
                  <li>No compartas este código con nadie</li>
                  <li>Si no solicitaste este cambio, ignora este correo</li>
                  <li>El código solo puede usarse una vez</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-code" 
               style="background-color: #2563eb; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; transition: background-color 0.3s ease;">
               Verificar código
            </a>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 25px 0 20px;">
            <p style="color: #4b5563; font-size: 15px; line-height: 1.5; margin: 0; text-align: center;">
              <strong>¿Necesitas ayuda?</strong> Si tienes problemas con la recuperación de tu contraseña, 
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/contacto" style="color: #2563eb; text-decoration: none; font-weight: 500;">contacta a nuestro equipo de soporte</a>.
            </p>
          </div>
          
          <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 15px;">
              Si no solicitaste este cambio, tu cuenta sigue siendo segura.<br>
              <strong style="color: #f97316;">El equipo de Red Maestro</strong>
            </p>
            
            <div style="margin-top: 15px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/terms" style="color: #6b7280; text-decoration: none; font-size: 12px; margin: 0 10px;">Términos y Condiciones</a>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/privacy" style="color: #6b7280; text-decoration: none; font-size: 12px; margin: 0 10px;">Política de Privacidad</a>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" style="color: #6b7280; text-decoration: none; font-size: 12px; margin: 0 10px;">Centro de Ayuda</a>
            </div>
            
            <div style="margin-top: 20px;">
              <span style="color: #9ca3af; font-size: 12px;">© ${new Date().getFullYear()} Red Maestro. Todos los derechos reservados.</span>
            </div>
          </div>
        </div>
      `
    });

    console.log('Correo de recuperación enviado correctamente:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error al enviar el correo de recuperación:', error);
    return false;
  }
}


export async function sendPasswordChangeConfirmationEmail(to: string, name: string) {
  try {
    const info = await transporter.sendMail({
      from: `"Red Maestro" <${process.env.EMAIL_FROM}>`,
      to,
      subject: 'Contraseña actualizada exitosamente 🔒',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="text-align: center; margin-bottom: 25px;">
            <img src="https://res.cloudinary.com/dil83zjxy/image/upload/v1750661412/maestro-chasquilla/profiles/ud45ed86grzvdp3bcpg5.png" alt="Red Maestro" style="max-width: 180px; height: auto;" />
          </div>
          
          <div style="background-color: #f0f9ff; border-left: 4px solid #0ea5e9; padding: 15px 20px; margin-bottom: 25px; border-radius: 6px;">
            <h2 style="color: #0ea5e9; margin-top: 0; font-size: 24px; font-weight: 600;">¡Contraseña actualizada! ✅</h2>
            <p style="color: #4b5563; font-size: 16px; margin-bottom: 0;">
              Tu contraseña ha sido cambiada exitosamente.
            </p>
          </div>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hola <strong>${name}</strong>,
          </p>
          
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            Te confirmamos que tu contraseña ha sido actualizada correctamente el ${new Date().toLocaleString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}.
          </p>
          
          <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 25px 0;">
            <div style="display: flex; align-items: flex-start;">
              <span style="color: #f59e0b; font-size: 18px; margin-right: 10px;">🔐</span>
              <div>
                <p style="color: #92400e; font-size: 14px; font-weight: 600; margin: 0 0 5px 0;">Importante:</p>
                <p style="color: #92400e; font-size: 14px; margin: 0;">
                  Si no realizaste este cambio, por favor contacta inmediatamente a nuestro equipo de soporte.
                </p>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" 
               style="background-color: #0ea5e9; color: white; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block; transition: background-color 0.3s ease;">
               Iniciar sesión
            </a>
          </div>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 25px 0 20px;">
            <p style="color: #4b5563; font-size: 15px; line-height: 1.5; margin: 0; text-align: center;">
              <strong>¿Necesitas ayuda?</strong> Si tienes alguna pregunta sobre tu cuenta, 
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/contacto" style="color: #0ea5e9; text-decoration: none; font-weight: 500;">contacta a nuestro equipo de soporte</a>.
            </p>
          </div>
          
          <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 15px;">
              Tu cuenta está protegida y segura.<br>
              <strong style="color: #f97316;">El equipo de Red Maestro</strong>
            </p>
            
            <div style="margin-top: 20px;">
              <span style="color: #9ca3af; font-size: 12px;">© ${new Date().getFullYear()} Red Maestro. Todos los derechos reservados.</span>
            </div>
          </div>
        </div>
      `
    });

    console.log('Correo de confirmación enviado correctamente:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error al enviar el correo de confirmación:', error);
    return false;
  }
}