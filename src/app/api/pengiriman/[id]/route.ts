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
  const updated = await prisma.pengiriman.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  if (isNaN(id))
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });

  await prisma.pengiriman.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
