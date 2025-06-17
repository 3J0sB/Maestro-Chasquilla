
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { title } from "process";

export async function POST(request: NextRequest) {
    const body = await request.json()
    const { title, description, price, serviceTag, userId, image, smallDescription} =  body;

    const service = await prisma.services.create({
        data: {
            title: title,
            description: description,
            price: parseFloat(price),
            serviceTag: serviceTag,
            smallDescription: smallDescription,
            userId: userId,
            image: image,
            status: "PENDING",
        }})
    

    if (!service) {
        return NextResponse.json({ error: "Error al crear el servicio" }, { status: 500 })
    }
    return NextResponse.json({ message: "Servicio creado correctamente" }, { status: 200 })
}