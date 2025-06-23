import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const {id: serviceProviderId} = await params;

  if (!serviceProviderId) {
    return NextResponse.json({ error: "ID de proveedor no proporcionado" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "6", 10);
  const skip = (page - 1) * limit;

  try {
    const total = await prisma.services.count({
      where: { userId: serviceProviderId }
    });


    const services = await prisma.services.findMany({
      where: { userId: serviceProviderId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(
      { services, total },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: "Error al obtener los servicios" }, { status: 500 });
  }
}