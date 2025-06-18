import prisma from '@/lib/prisma';
import { NextResponse, NextRequest } from 'next/server';


export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category') || '';
        if (category === 'all') {
            const service = await prisma.services.findMany({
                where: {
                    status: 'APPROVED',
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
                        },
                    }
                }
            });
            return NextResponse.json(service);
        }
        console.log(category);

        if (!category) {
            const service = await prisma.services.findMany({
                where: {
                    status: 'APPROVED',
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
                        },
                    }
                }
            });
            return NextResponse.json(service);
        }

        const service = await prisma.services.findMany({
                            where: {
                    status: 'APPROVED',
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
                    },
                }
            }
        });

        return NextResponse.json(service);
    } catch (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json({ error: 'Error fetching services' }, { status: 500 });

    }
}