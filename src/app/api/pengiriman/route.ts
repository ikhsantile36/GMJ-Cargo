import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs"; // untuk password default

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      nomor_resi,
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
      status_barang,
    } = body;

    const beratFloat = berat !== undefined && berat !== null && berat !== ''
      ? parseFloat(berat)
      : null;

    // 1. Cek apakah user dengan nomor HP sudah ada
    let existingUser = await prisma.user.findUnique({
      where: {
        nomor_hp: nomor_hp_pengirim,
      },
    });

    // 2. Jika belum ada, buat user baru
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(nomor_hp_pengirim, 10); // password default sama dengan nomor HP
      existingUser = await prisma.user.create({
        data: {
          username: nama_pengirim.replace(/\s+/g, "_").toLowerCase() + "_" + Date.now(),
          email: `user${Date.now()}@autogen.local`, // email dummy unik
          nomor_hp: nomor_hp_pengirim,
          password: hashedPassword,
          role: "USER",
        },
      });
    }

    // 3. Buat data pengiriman dengan relasi ke user tersebut
    const result = await prisma.pengiriman.create({
      data: {
        nomor_resi,
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
        status_barang,
        user: {
          connect: { id: existingUser.id },
        },
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
    const data = await prisma.pengiriman.findMany({
      include: { user: true },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET /api/pengiriman error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
