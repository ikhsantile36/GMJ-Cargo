import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const data = await prisma.barang.findMany({
      orderBy: {
        tgl: 'desc',
      },
      include: {
        pengiriman: true, // hanya include relasi yang ada, seperti pengiriman
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
