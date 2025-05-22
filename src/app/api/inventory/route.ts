import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { writeFile } from 'fs/promises'
import path from 'path'
import { v4 as uuid } from 'uuid'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const formData = await req.formData()
  const lokasi = formData.get('lokasi') as string
  const status_barang = formData.get('status_barang') as string
  const keterangan = formData.get('keterangan') as string
  const nomor_resi = formData.get('nomor_resi') as string
  const fotoFile = formData.get('foto') as File | null

  let fotoPath: string | null = null

  if (fotoFile) {
    const bytes = await fotoFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const filename = `${uuid()}-${fotoFile.name}`
    const uploadPath = path.join(process.cwd(), 'public/uploads', filename)

    await writeFile(uploadPath, new Uint8Array(buffer))
    fotoPath = `/uploads/${filename}`
  }

  try {
    await prisma.inventory.create({
      data: {
        nomor_resi,
        lokasi,
        keterangan,
        foto: fotoPath || undefined,
      }
    })

    if (status_barang) {
      await prisma.pengiriman.update({
        where: { nomor_resi },
        data: { status_barang: status_barang as any }
      })
    }

    return NextResponse.json({ message: 'Tracking berhasil ditambahkan' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Gagal menyimpan tracking' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const nomor_resi = searchParams.get('nomor_resi');

  if (!nomor_resi) {
    return NextResponse.json({ error: 'Nomor resi wajib diisi' }, { status: 400 });
  }

  try {
    const pengiriman = await prisma.pengiriman.findUnique({
      where: { nomor_resi },
    });

    if (!pengiriman) {
      return NextResponse.json({ error: 'Data pengiriman tidak ditemukan' }, { status: 404 });
    }

    const history = await prisma.inventory.findMany({
      where: { nomor_resi },
      orderBy: { waktu_update: 'asc' }, 
    });

    const initialEntry = {
      lokasi: pengiriman.wilayah,
      keterangan: 'Awal pengiriman',
      waktu_update: pengiriman.createdAt ?? new Date(), // fallback ke now kalau tidak ada createdAt
    };

    // Gabungkan entry awal + histori inventory
    const fullHistory = [initialEntry, ...history];

    return NextResponse.json(fullHistory);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}
