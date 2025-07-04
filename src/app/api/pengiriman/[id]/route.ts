// app/api/pengiriman/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id))
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

  const pengiriman = await prisma.pengiriman.findUnique({
    where: { id },
    include: {
      barangList: true, 
    },
  });
  if (!pengiriman) {
    return NextResponse.json({ message: "Data not found" }, { status: 404 });
  }

  return NextResponse.json(pengiriman);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id))
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

  const body = await req.json();

  const {
    stt,
    sttb,
    nama_pengirim,
    alamat_pengiriman,
    biaya,
    jenis_kiriman,
    penerima_dan_hp,
    barangList = [],
    status_barang, // ✅ tambahkan ini
  } = body;

  try {
    // 1. Update data pengiriman (✅ tambahkan status_barang jika ada)
    const updatedPengiriman = await prisma.pengiriman.update({
      where: { id },
      data: {
        nama_pengirim,
        alamat_pengiriman,
        biaya,
        sttb,
        ...(status_barang && { status_barang }), // ✅ hanya update jika ada
      },
    });

    // 2. Update data barang umum
    await prisma.barang.updateMany({
      where: { pengirimanId: id },
      data: {
        stt,
        jenis_kiriman,
        penerima_dan_hp,
      },
    });

    // 3. Update tagihan barang
    for (const barang of barangList) {
      if (barang.id && typeof barang.tagihan === "number") {
        await prisma.barang.update({
          where: { id: barang.id },
          data: { tagihan: barang.tagihan },
        });
      }
    }

    return NextResponse.json(updatedPengiriman);
  } catch (error) {
    console.error("PUT /api/pengiriman/[id] error:", error);
    return NextResponse.json(
      {
        message: "Gagal mengupdate data",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}



export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
  }

  try {
    // Hapus semua data barang yang terkait
    await prisma.barang.deleteMany({
      where: { pengirimanId: id },
    });

    // Hapus data inventory yang berelasi (berdasarkan nomor_resi)
    const pengiriman = await prisma.pengiriman.findUnique({
      where: { id },
    });

    if (pengiriman?.nomor_resi) {
      await prisma.inventory.deleteMany({
        where: { nomor_resi: pengiriman.nomor_resi },
      });
    }

    // Hapus data penerimaan barang jika ada
    await prisma.penerimaanBarang.deleteMany({
      where: { pengirimanId: id },
    });

    // Hapus pengiriman
    await prisma.pengiriman.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 }); // Sukses tanpa isi
  } catch (error) {
    console.error("DELETE /api/pengiriman/[id] error:", error);
    return NextResponse.json(
      {
        message: "Gagal menghapus data",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

