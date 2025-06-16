import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Obtener todas las categorías ordenadas por nombre
    const categories = await prisma.categories.findMany({
      orderBy: {
        name: 'asc'
      },

    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return NextResponse.json(
      { error: "Error al obtener categorías" },
      { status: 500 }
    );
  }
}