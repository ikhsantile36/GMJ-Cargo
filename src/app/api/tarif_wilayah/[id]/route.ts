import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const data = await prisma.tarif_wilayah.findUnique({ where: { id: Number(params.id) } });
  return NextResponse.json(data);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updated = await prisma.tarif_wilayah.update({
    where: { id: Number(params.id) },
    data: body,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.tarif_wilayah.delete({ where: { id: Number(params.id) } });
  return NextResponse.json({ message: 'Deleted' });
}
