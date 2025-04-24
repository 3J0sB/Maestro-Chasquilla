import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
    const body = await request.json()
    console.log(body)
    const { email, password, confirmPassword } = body
    if (password !== confirmPassword) {
        return NextResponse.json("Las contraseñas no coinciden")
    }
    const findUser = await prisma.user.findFirst({
        where: { 
            email: email 
        }
    })
    if (findUser) {
        return NextResponse.json("El correo ya existe")
    }
    console.log(findUser)
    return  NextResponse.json("data a registrar: " + body)
}