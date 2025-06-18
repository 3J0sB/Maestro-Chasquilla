/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any*/

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const categories = await prisma.categories.findMany({});

        if (!categories || categories.length === 0) {
            return NextResponse.json({ error: "No se encontraron categorías" }, { status: 404 });
        }
        
        return NextResponse.json(categories, { status: 200 });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({ error: "Error al obtener las categorías" }, { status: 500 });
    }
}