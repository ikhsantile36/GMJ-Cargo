import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const data = await prisma.pengiriman.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,                // Relasi user (pengirim)
        penerimaanBarang: true,   // Relasi penerimaan
        inventory: true,          // Relasi ke inventory
      },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/pengiriman error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal mengambil data pengiriman.' },
      { status: 500 }
    );
  }
}