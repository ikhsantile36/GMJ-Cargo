import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs"; // untuk password default
import { format } from 'date-fns';

// Fungsi generate STTB otomatis berdasarkan bulan + urutan
export const generateSTTB = async (): Promise<string> => {
  const now = new Date();
  const bulan = format(now, 'MM'); // "05"
  const tahun = format(now, 'yyyy'); // "2025"

  const count = await prisma.pengiriman.count({
    where: {
      createdAt: {
        gte: new Date(`${tahun}-${bulan}-01T00:00:00Z`),
        lt: new Date(`${tahun}-${bulan}-31T23:59:59Z`),
      },
    },
  });

  const urutan = count + 1;
  const sttb = `${bulan}${String(urutan).padStart(3, '0')}`; // Misal: 05001

  return sttb;
};

// Handler API untuk membuat pengiriman
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      nomor_resi,
      jenis,
      nama_pengirim,
      nama_penerima,
      nomor_hp_pengirim,
      nomor_hp_penerima,
      alamat_pengiriman,
      wilayah,
      biaya,
      jumlah_barang,
      isi_barang,
      catatan,
      volume_rb,
      total_volume,
      actual,
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
      const hashedPassword = await bcrypt.hash(nomor_hp_pengirim, 10);
      existingUser = await prisma.user.create({
        data: {
          username: nama_pengirim.replace(/\s+/g, "_").toLowerCase() + "_" + Date.now(),
          email: `user${Date.now()}@autogen.local`, // email dummy unik
          nomor_hp: nomor_hp_pengirim,
          password: "",
          role: "USER",
        },
      });
    }

    // 3. Generate kode STTB otomatis
    const sttb = await generateSTTB();

    // 4. Buat data pengiriman
    const result = await prisma.pengiriman.create({
      data: {
        nomor_resi,
        jenis,
        nama_pengirim,
        nama_penerima,
        nomor_hp_pengirim,
        nomor_hp_penerima,
        alamat_pengiriman,
        wilayah,
        biaya,
        jumlah_barang,
        isi_barang,
        catatan,
        sttb,
        volume_rb,
        total_volume,
        actual,
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
