import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { compare } from "bcrypt-ts"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, password } = body
  

  const user = await prisma.user.findUnique({
    where: { email }
  })
  
  const serviceProviderUser = await prisma.serviceProviderUser.findUnique({
    where: { email }
  })
  
  // Verificar si el usuario existe en alguna de las tablas
  if (!user && !serviceProviderUser) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 })
  }
  
  if (user?.deletedAt) {
    return NextResponse.json({ error: "Cuenta desactivada" }, { status: 403 })
  }
  
  if (serviceProviderUser?.deletedAt) {
    return NextResponse.json({ error: "Cuenta desactivada" }, { status: 403 })
  }

  let isValidPassword = false;
  let userData = null;
  
  // Si el usuario está en la tabla principal de usuarios
  if (user && user.hashedPassword) {
    isValidPassword = await compare(password, user.hashedPassword);
    if (isValidPassword) {
      userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        lastName: user.lastName,
        role: user.role,
      };
    }
  } 
  // Si el usuario está en la tabla de proveedores de servicio
  else if (serviceProviderUser && serviceProviderUser.hashedPassword) {
    isValidPassword = await compare(password, serviceProviderUser.hashedPassword);
    if (isValidPassword) {
      userData = {
        id: serviceProviderUser.id,
        name: serviceProviderUser.name,
        lastName: serviceProviderUser.lastName,
        email: serviceProviderUser.email,
        image: serviceProviderUser.image,
        role: serviceProviderUser.role,
      };
    }
  }
  
  // Si la contraseña no es válida para ninguna de las cuentas
  if (!isValidPassword) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
  }
  
  // Retornar la información del usuario autenticado
  return NextResponse.json(userData)
}