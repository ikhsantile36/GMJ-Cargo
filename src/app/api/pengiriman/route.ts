import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { format } from 'date-fns';

import { generateSTTB } from "@/utils/generateSTTB";



export async function POST(req: NextRequest) {
  
  try {
    const body = await req.json();
    console.log('Received data:', body);

    // Destructuring dengan validasi default
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
      berat_satuan,
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
    
    // 3. Validasi dan transformasi data array
    const barangArray = Array.isArray(barang) ? barang : [];
    const biayaSatuanArray = Array.isArray(biaya_satuan) ? biaya_satuan : [];
    const beratSatuanArray = Array.isArray(berat_satuan) ? berat_satuan : [];

    // 4. Buat data pengiriman utama
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
        biaya: Number(biaya) || 0,
        jumlah_barang: Number(jumlah_barang) || 0,
        isi_barang,
        catatan,
        sttb,
        volume_rb: Number(volume_rb) || 0,
        total_volume: Number(total_volume) || 0,
        total_biaya_gmj: Number(total_biaya_gmj) || 0,
        total_biaya_vendor: Number(total_biaya_vendor) || 0,
        kategori_barang,
        metode_penghitungan,
        barang: barangArray,
        berat_satuan: beratSatuanArray, // Simpan berat_satuan sebagai array
        status_barang,
        biaya_satuan: biayaSatuanArray,
        user: { connect: { id: existingUser.id } },
      },
    });

    // 5. Buat data barang terkait
    for (const [index, b] of barangArray.entries()) {
      const panjang = Number(b.panjang) || 0;
      const lebar = Number(b.lebar) || 0;
      const tinggi = Number(b.tinggi) || 0;
      const m3 = (panjang * lebar * tinggi) / 1000000;
      const vw = (panjang * lebar * tinggi) / 4000;
      const beratItem = beratSatuanArray[index] || 0;
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
          kg: beratSatuanArray[index] || 0,
          tagihan: biaya_satuan[index] || 0,
          alamat: result.alamat_pengiriman,

          pengiriman: { connect: { id: result.id } }
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      data: result,
      message: "Data pengiriman berhasil disimpan" 
    }, { status: 201 });

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