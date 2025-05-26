import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Ambil semua data barang
export async function GET(req: NextRequest) {
  try {
    const data = await prisma.barang.findMany({
      orderBy: {
        tgl: 'desc',
      },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('GET /api/barang error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengambil data barang.' }, { status: 500 });
  }
}

// PUT: Update data barang
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updateData } = body;

    const updatedBarang = await prisma.barang.update({
      where: { id },
      data: {
        ...updateData,
        tgl: updateData.tgl ? new Date(updateData.tgl) : undefined,
      },
    });

    return NextResponse.json({ success: true, data: updatedBarang });
  } catch (error) {
    console.error('PUT /api/barang error:', error);
    return NextResponse.json({ success: false, message: 'Gagal mengupdate barang.' }, { status: 500 });
  }
}

// DELETE: Hapus data barang
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    await prisma.barang.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Barang berhasil dihapus.' });
  } catch (error) {
    console.error('DELETE /api/barang error:', error);
    return NextResponse.json({ success: false, message: 'Gagal menghapus barang.' }, { status: 500 });
  }
}
