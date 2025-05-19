import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.tarif_volume_vendor.findMany();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      volume_min,
      volume_max,
      biaya_perBarang,
      biaya_diskon,
      keterangan,
    } = body;

    const data = await prisma.tarif_volume_vendor.create({
      data: {
        volume_min,
        volume_max,
        biaya_perBarang,
        biaya_diskon,
        keterangan,
      },
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Failed to create data" },
      { status: 500 }
    );
  }
}
