import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // pastikan path sesuai dengan project kamu

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      jenis,
      nama_pengirim,
      nomor_hp_pengirim,
      alamat_pengiriman,
      wilayah,
      biaya,
      jumlah_barang,
      volume_rb,
      total_volume,
      total_biaya_gmj,
      total_biaya_vendor,
      kategori_barang,
      metode_penghitungan,
      barang,
      berat,
    } = body;

    const beratFloat = berat !== undefined && berat !== null && berat !== ''
  ? parseFloat(berat)
  : null;

    const result = await prisma.pengiriman.create({
      data: {
        jenis,
        nama_pengirim,
        nomor_hp_pengirim,
        alamat_pengiriman,
        wilayah,
        biaya,
        jumlah_barang,
        volume_rb,
        total_volume,
        total_biaya_gmj,
        total_biaya_vendor,
        kategori_barang,
        metode_penghitungan,
        barang,
        berat: beratFloat ?? 0,
      },
    });

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error("POST /api/pengiriman error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = await prisma.pengiriman.findMany();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET /api/pengiriman error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
