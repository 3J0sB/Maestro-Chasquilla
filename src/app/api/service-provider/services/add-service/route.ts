
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { name, description, price, serviceTag, userId } =  body;

    const service = await prisma.services.create({
        data: {
            title: name,
            description: description,
            price: parseFloat(price),
            serviceTag: serviceTag,
            userId: userId,
        }})
    

    if (!service) {
        return NextResponse.json({ error: "Error al crear el servicio" }, { status: 500 })
    }
    return NextResponse.json({ message: "Servicio creado correctamente" }, { status: 200 })
}