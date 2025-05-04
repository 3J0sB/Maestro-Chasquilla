import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { compare } from "bcrypt-ts"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, password } = body
  
  const user = await prisma.user.findUnique({
    where: { email }
  })
  
  if (!user || !user.hashedPassword) {
    return NextResponse.json({ error: "User not found" }, { status: 401 })
  }
  
  const isValidPassword = await compare(password, user.hashedPassword)
  
  if (!isValidPassword) {
    return NextResponse.json({ error: "Credenciales invalidas" }, { status: 401 })
  }
  console.log("user from endpoint --->", user)
  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
  })
}