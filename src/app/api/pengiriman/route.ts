import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      jenis,
      nama_pengirim,
      alamat_pengiriman,
      wilayah,
      panjang,
      lebar,
      tinggi,
      volume_rb,
      volume_akhir,
      berat,
      metode_penghitungan,
      kategori_barang,
      nomor_hp,
    } = body;

    const pengiriman = await prisma.pengiriman.create({
      data: {
        jenis,
        nama_pengirim,
        alamat_pengiriman,
        wilayah,
        panjang: parseFloat(panjang),
        lebar: parseFloat(lebar),
        tinggi: parseFloat(tinggi),
        volume_rb,
        volume_akhir,
        berat: parseFloat(berat),
        metode_penghitungan,
        kategori_barang: metode_penghitungan === "berat" ? kategori_barang : null,
        nomor_hp_pengirim: nomor_hp,
      },
    });

    return NextResponse.json(pengiriman, { status: 201 });
  } catch (error) {
    console.error("Error saat membuat pengiriman:", error);
    return NextResponse.json(
      { error: "Gagal membuat pengiriman" },
      { status: 500 }
    );
  }
}
