import { NextResponse } from "next/server";
import formidable, { File } from "formidable";
import { Readable } from "stream";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";



export const dynamic = "force-dynamic";

const uploadDir = path.join(process.cwd(), "public/uploads-penerimaan-barang");

// function readableWebToNodeStream(webStream: ReadableStream<Uint8Array>) {
//   const reader = webStream.getReader();
//   return new Readable({
//     async read() {
//       const { done, value } = await reader.read();
//       this.push(done ? null : Buffer.from(value));
//     },
//   });
// }

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const pengirimanId = parseInt(
      formData.get("pengirimanId")?.toString() || ""
    );
    if (!pengirimanId) {
      return NextResponse.json(
        { message: "pengirimanId wajib" },
        { status: 400 }
      );
    }

    const fotoBarang = formData.get("foto_barang") as Blob | null;
    const fotoPembayaran = formData.get("foto_pembayaran") as Blob | null;
    const fotoInvoice = formData.get("foto_invoice") as Blob | null;

    if (!fotoBarang || !fotoPembayaran || !fotoInvoice) {
      return NextResponse.json(
        { message: "File wajib diupload" },
        { status: 400 }
      );
    }

    // Simpan file secara manual
    fs.mkdirSync(uploadDir, { recursive: true });

    const saveFile = async (file: Blob, filename: string) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filePath = path.join(uploadDir, filename);
      await fs.promises.writeFile(filePath, new Uint8Array(buffer));
      return "/uploads-penerimaan-barang/" + filename;
    };

    const fotoBarangPath = await saveFile(
      fotoBarang,
      `fotoBarang-${Date.now()}.jpg`
    );
    const fotoPembayaranPath = await saveFile(
      fotoPembayaran,
      `fotoPembayaran-${Date.now()}.jpg`
    );
    const fotoInvoicePath = await saveFile(
      fotoInvoice,
      `fotoInvoice-${Date.now()}.jpg`
    );

    const keterangan = formData.get("keterangan")?.toString() || "";

    const result = await prisma.penerimaanBarang.create({
      data: {
        pengirimanId,
        keterangan,
        fotoBarang: fotoBarangPath,
        fotoPembayaran: fotoPembayaranPath,
        fotoInvoice: fotoInvoicePath,
      },
    });

    await prisma.pengiriman.update({
      where: { id: pengirimanId },
      data: { status_barang: "butuh_validasi" },
    });

    return NextResponse.json({ message: "Berhasil disimpan", data: result });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
  }

  try {
    const data = await prisma.penerimaanBarang.findFirst({
      where: { pengirimanId: id },
    });

    if (!data) {
      return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/penerimaan/[id] error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}