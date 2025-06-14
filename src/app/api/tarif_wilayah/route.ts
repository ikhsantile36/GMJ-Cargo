import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET all data
export async function GET() {
  try {
    const data = await prisma.tarif_wilayah.findMany();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

// CREATE new data
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { jenis, wilayah, benda_ringan_rb, benda_berat_rb, volume_rb, cost_minimum, estimasi } = body;

    const newTarif = await prisma.tarif_wilayah.create({
      data: {
        jenis,
        wilayah,
        benda_ringan_rb,
        benda_berat_rb,
        volume_rb,
        cost_minimum,
        estimasi,
      },
    });

    return NextResponse.json(newTarif, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'Failed to create data';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}


// UPDATE existing data by ID
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, jenis, wilayah, benda_ringan_rb, benda_berat_rb, volume_rb, cost_minimum, estimasi } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing ID for update' }, { status: 400 });
    }

    const existing = await prisma.tarif_wilayah.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Data not found' }, { status: 404 });
    }

    const updated = await prisma.tarif_wilayah.update({
      where: { id },
      data: {
        jenis,
        wilayah,
        benda_ringan_rb,
        benda_berat_rb,
        volume_rb,
        cost_minimum,
        estimasi,
      },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    const errorMessage = (error instanceof Error) ? error.message : 'Failed to update data';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}


// DELETE data by ID
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing ID for delete' }, { status: 400 });
    }

    const existing = await prisma.tarif_wilayah.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Data not found' }, { status: 404 });
    }

    await prisma.tarif_wilayah.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Data deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
  }
}
