import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from 'bcrypt'
import { sendWelcomeEmail } from "@/lib/mail"


export async function POST(request: NextRequest) {
    const body = await request.json()
    console.log(body)
    const { email, password, name, lastName, lastName2, rut} = body

    const findUser = await prisma.user.findFirst({
        where: { 
            email: email 
        }
    })
    console.log(findUser)
    if (findUser) {
        return NextResponse.json({message: "El correo ya existe"}, { status: 400 })
    }
    
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await prisma.user.create({
        data: {
            email: email,
            hashedPassword: hashedPassword,
            name: name,
            lastName: lastName,
            lastName2: lastName2,
            role: 'USER',
            rut: rut
        }
    })

    await sendWelcomeEmail(email, name,"consumidor de servicios");
    console.log(newUser)
    return  NextResponse.json({message: "new user added: ", status: 200})
}