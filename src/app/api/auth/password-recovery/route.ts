import { NextRequest, NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import prisma from "@/lib/prisma"
import { sendPasswordRecoveryEmail } from '@/lib/mail';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { message: 'Email válido es requerido' },
                { status: 400 }
            );
        }

        // Verificar si el usuario existe en cualquiera de las dos tablas
        const user = await prisma.user.findUnique({
            where: { email },
        });

        const providerUser = await prisma.serviceProviderUser.findFirst({
            where: { email },
        });

        // Si no existe en ninguna de las dos tablas
        if (!user && !providerUser) {
            console.log(`Email ${email} no encontrado en el sistema`);
            return NextResponse.json(
                { message: 'Si el email existe en nuestro sistema, se enviará un código de verificación' },
                { status: 200 }
            );
        }

        // Determinar qué usuario usar y su tipo
        const targetUser = user || providerUser;
        const userType = user ? 'user' : 'serviceProvider';
        const userId = targetUser!.id;
        const userName = targetUser!.name || 'Usuario';

        // Generar TOTP de 6 dígitos
        const secret = authenticator.generateSecret();
        const token = authenticator.generate(secret);

        // Guardar el código en la base de datos con expiración
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
        
        // Crear token con los datos apropiados según el tipo de usuario
        const tokenData = {
            userType,
            token,
            expiresAt,
            ...(userType === 'user' 
                ? { userId: userId } 
                : { providerId: userId }
            )
        };

        await prisma.passwordResetToken.create({
            data: tokenData,
        });

        // Enviar correo con el código
        const emailSent = await sendPasswordRecoveryEmail(
            email,
            userName,
            token
        );

        if (!emailSent) {
            console.log('Error al enviar el correo de recuperación');
            return NextResponse.json(
                { message: 'Error al enviar el correo. Intenta nuevamente.' },
                { status: 500 }
            );
        }

        console.log(`Código de verificación enviado a ${email}`);
        return NextResponse.json(
            { message: 'Código de verificación enviado correctamente' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error en password recovery:', error);
        return NextResponse.json(
            { message: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}