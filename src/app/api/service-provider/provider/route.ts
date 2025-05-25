import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
    // console.log(request)
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id") || "";
        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const provider = await prisma.serviceProviderUser.findUnique({
            where: {
                id,
            },
            include: {
                services: true
            }

        });

        if (!provider) {
            return NextResponse.json({ error: "Service not found" }, { status: 404 });
        }

        return NextResponse.json(provider);
        
    } catch (error) {
        console.error("Error fetching service:", error);
        return NextResponse.json({ error: "Error fetching service" }, { status: 500 });
        
    }
}