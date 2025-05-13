import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from 'bcrypt'


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
    const newUser = await prisma.serviceProviderUser.create({
        data: {
            email: email,
            hashedPassword: hashedPassword,
            name: name,
            rut,
            lastName: lastName,
            lastName2: lastName2,
            role: 'SERVICE_PROVIDER',
        }
    })
    console.log(newUser)
    return  NextResponse.json({message: "new user added: ", status: 200})
}