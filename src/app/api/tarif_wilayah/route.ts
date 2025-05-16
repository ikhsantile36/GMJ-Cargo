import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const data = await prisma.tarif_wilayah.findMany();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const newTarif = await prisma.tarif_wilayah.create({ data: body });
  return NextResponse.json(newTarif);
}
