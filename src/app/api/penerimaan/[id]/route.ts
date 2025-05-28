import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface PenerimaanBarang {
  id: number;
  pengirimanId: number;
  // tambahkan field lainnya sesuai model Prisma Anda
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
): Promise<NextResponse<PenerimaanBarang | { message: string }>> {
  try {
    // Validasi ID
    const pengirimanId = parseInt(params.id);
    if (isNaN(pengirimanId)) {
      return NextResponse.json(
        { message: "ID harus berupa angka" },
        { status: 400 }
      );
    }

    // Query database
    const penerimaan = await prisma.penerimaanBarang.findUnique({
      where: { pengirimanId },
      include: {
        // Sertakan relasi jika diperlukan
        pengiriman: true
      }
    });

    if (!penerimaan) {
      return NextResponse.json(
        { message: "Data penerimaan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(penerimaan);
    
  } catch (error) {
    console.error("Error fetching penerimaan:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}