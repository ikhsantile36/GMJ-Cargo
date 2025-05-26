import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { format } from 'date-fns';

export const generateSTTB = async (): Promise<string> => {
  const now = new Date();
  const bulan = format(now, 'MM');
  const tahun = format(now, 'yyyy');

  const count = await prisma.pengiriman.count({
    where: {
      createdAt: {
        gte: new Date(`${tahun}-${bulan}-01T00:00:00Z`),
        lt: new Date(`${tahun}-${bulan}-31T23:59:59Z`),
      },
    },
  });

  const urutan = count + 1;
  return `${bulan}${String(urutan).padStart(3, '0')}`;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received data:', body); // Log data yang diterima

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
      total_biaya_gmj,
      total_biaya_vendor,
      kategori_barang,
      metode_penghitungan,
      barang,
      berat,
      status_barang,
      biaya_satuan,
    } = body;

    // Validasi data yang diperlukan
    if (!nomor_resi || !nama_pengirim || !nama_penerima || !nomor_hp_pengirim || !wilayah) {
      return NextResponse.json(
        { success: false, message: "Data yang diperlukan tidak lengkap" },
        { status: 400 }
      );
    }

    const beratFloat = parseFloat(berat) || 0;

    // 1. Cek atau buat user
    let existingUser = await prisma.user.findUnique({
      where: { nomor_hp: nomor_hp_pengirim },
    });

    if (!existingUser) {
      existingUser = await prisma.user.create({
        data: {
          username: `${nama_pengirim.replace(/\s+/g, "_").toLowerCase()}_${Date.now()}`,
          email: `user${Date.now()}@autogen.local`,
          nomor_hp: nomor_hp_pengirim,
          password: "",
          role: "USER",
        },
      });
    }

    // 2. Generate STTB
    const sttb = await generateSTTB();

    // 3. Pastikan barang dan biaya_satuan adalah array
    const barangArray = Array.isArray(barang) ? barang : [];
    const biayaSatuanArray = Array.isArray(biaya_satuan) ? biaya_satuan : [];

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
        biaya: parseFloat(biaya) || 0,
        jumlah_barang: parseInt(jumlah_barang) || 0,
        isi_barang,
        catatan,
        sttb,
        volume_rb: parseFloat(volume_rb) || 0,
        total_volume: parseFloat(total_volume) || 0,
        total_biaya_gmj: parseFloat(total_biaya_gmj) || 0,
        total_biaya_vendor: parseFloat(total_biaya_vendor) || 0,
        kategori_barang,
        metode_penghitungan,
        barang: barangArray,
        berat: beratFloat,
        status_barang,
        biaya_satuan: biayaSatuanArray,
        user: { connect: { id: existingUser.id } },
      },
    });

    // 5. Buat data barang terkait
    for (const [index, b] of barangArray.entries()) {
      const panjang = parseFloat(b.panjang) || 0;
      const lebar = parseFloat(b.lebar) || 0;
      const tinggi = parseFloat(b.tinggi) || 0;
      const m3 = (panjang * lebar * tinggi) / 1000000;
      const vw = (panjang * lebar * tinggi) / 4000;
      const tagihan = biayaSatuanArray[index] || 0;

      await prisma.barang.create({
        data: {
          tgl: new Date(),
          stt: result.sttb,
          tujuan: result.wilayah,
          penerima_dan_hp: `${result.nama_penerima} / ${result.nomor_hp_penerima}`,
          pengirim_dan_hp: `${result.nama_pengirim} / ${result.nomor_hp_pengirim}`,
          jenis_kiriman: result.jenis,
          catatan: result.catatan || "",
          koli: index + 1, // ⬅️ nomor urut
          panjang: parseFloat(b.panjang),
          lebar: parseFloat(b.lebar),
          tinggi: parseFloat(b.tinggi),
          m3: (parseFloat(b.panjang) * parseFloat(b.lebar) * parseFloat(b.tinggi)) / 1000000,
          vw: (parseFloat(b.panjang) * parseFloat(b.lebar) * parseFloat(b.tinggi)) / 4000,
          kg: result.berat ?? 0,
          tagihan: biaya_satuan[index] || 0,
          alamat: result.alamat_pengiriman,
          pengiriman: { connect: { id: result.id } }
        }
      });
    }

    return NextResponse.json({ success: true, data: result }, { status: 201 });

  } catch (error) {
    console.error("POST /api/pengiriman error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Terjadi kesalahan pada server.",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = await prisma.pengiriman.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET /api/pengiriman error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Terjadi kesalahan pada server.",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}