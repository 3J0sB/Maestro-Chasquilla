import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest ){
    try {
        const serviceAndReviews = await prisma.services.findMany({
            include: {
                reviews: {
                    include: {
                        user: true
                    }
                },

            }
        })

        if (!serviceAndReviews) {
            return NextResponse.json({ error: "No services found" }, { status: 404 });
        }
        
        return NextResponse.json(serviceAndReviews);

    } catch (error) {
        console.error("Error fetching services and reviews:", error);
        return NextResponse.json({ error: "Error fetching services and reviews" }, { status: 500 });
        
    }
}