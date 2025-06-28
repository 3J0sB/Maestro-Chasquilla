import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { token, email } = await request.json();

    if (!token || token.length !== 6) {
      return NextResponse.json(
        { message: 'Código de verificación inválido' },
        { status: 400 }
      );
    }

    // Buscar el token en la base de datos
    const passwordResetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token,
        used: false,
        expiresAt: {
          gte: new Date(),
        },
      },
      include: {
        user: true,
        serviceProviderUser: true,
      },
    });

    if (!passwordResetToken) {
      return NextResponse.json(
        { message: 'Código inválido o expirado' },
        { status: 400 }
      );
    }

    // Obtener el usuario correcto según el tipo
    const targetUser = passwordResetToken.user || passwordResetToken.serviceProviderUser;
    
    if (email && targetUser?.email !== email) {
      return NextResponse.json(
        { message: 'Código inválido' },
        { status: 400 }
      );
    }

    // Marcar el token como usado
    await prisma.passwordResetToken.update({
      where: {
        id: passwordResetToken.id,
      },
      data: {
        used: true,
      },
    });

    // Generar un token temporal para el reseteo de contraseña
    const resetToken = crypto.randomUUID();
    const resetExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    // Crear token de reset con los campos correctos
    const resetTokenData = {
      userType: passwordResetToken.userType,
      token: resetToken,
      expiresAt: resetExpiresAt,
      used: false,
      ...(passwordResetToken.userType === 'user' 
        ? { userId: passwordResetToken.userId } 
        : { providerId: passwordResetToken.providerId })
    };

    await prisma.passwordResetToken.create({
      data: resetTokenData,
    });

    return NextResponse.json(
      { 
        message: 'Código verificado correctamente',
        resetToken: resetToken,
        userId: passwordResetToken.userId || passwordResetToken.providerId,
        userType: passwordResetToken.userType
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error en verify-code:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}