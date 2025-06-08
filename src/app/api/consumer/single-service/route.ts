import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id") || "";
        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const service = await prisma.services.findUnique({
            where: {
                id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        lastName: true,
                        lastName2: true,
                        rut: true,
                        email: true,
                        image: true,
                        areasOfExpertise: true,
                        description: true,
                    },
                },
            },
        });

        if (!service) {
            return NextResponse.json({ error: "Service not found" }, { status: 404 });
        }

        return NextResponse.json(service);
        
    } catch (error) {
        console.error("Error fetching service:", error);
        return NextResponse.json({ error: "Error fetching service" }, { status: 500 });
        
    }
}