import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(request: Request, { params }: { params: { id: string } }) {
  const pengirimanId = parseInt(params.id);

  if (isNaN(pengirimanId)) {
    return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
  }

  const penerimaan = await prisma.penerimaanBarang.findUnique({
    where: { pengirimanId },
  });

  if (!penerimaan) {
    return NextResponse.json({ message: "Data tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(penerimaan);
}
