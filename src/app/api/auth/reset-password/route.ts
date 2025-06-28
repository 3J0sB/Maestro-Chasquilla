import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma"
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: 'Token y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Validar requisitos de contraseña
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!minLength || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return NextResponse.json(
        { message: 'La contraseña no cumple con los requisitos de seguridad' },
        { status: 400 }
      );
    }

    // Buscar el token de reset válido
    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token,
        used: false,
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!resetToken) {
      return NextResponse.json(
        { message: 'Token inválido o expirado' },
        { status: 400 }
      );
    }

    // Hash de la nueva contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Actualizar la contraseña según el tipo de usuario
    if (resetToken.userType === 'user' && resetToken.userId) {
      await prisma.user.update({
        where: {
          id: resetToken.userId,
        },
        data: {
          hashedPassword: hashedPassword,
          updatedAt: new Date(),
        },
      });
    } else if (resetToken.userType === 'serviceProvider' && resetToken.providerId) {
      await prisma.serviceProviderUser.update({
        where: {
          id: resetToken.providerId,
        },
        data: {
          hashedPassword: hashedPassword,
          updatedAt: new Date(),
        },
      });
    } else {
      return NextResponse.json(
        { message: 'Token inválido o tipo de usuario no encontrado' },
        { status: 400 }
      );
    }

    // Marcar el token como usado e invalidar otros tokens del usuario
    const userIdToUpdate = resetToken.userId || resetToken.providerId;
    
    await prisma.passwordResetToken.updateMany({
      where: {
        OR: [
          { userId: userIdToUpdate },
          { providerId: userIdToUpdate }
        ],
        used: false,
      },
      data: {
        used: true,
      },
    });

    return NextResponse.json(
      { message: 'Contraseña actualizada correctamente' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error en reset-password:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}