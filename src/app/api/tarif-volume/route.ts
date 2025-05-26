import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all data
export async function GET() {
  try {
    const data = await prisma.tarif_volume_vendor.findMany();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// CREATE new data
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

// UPDATE data by ID
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      volume_min,
      volume_max,
      biaya_perBarang,
      biaya_diskon,
      keterangan,
    } = body;

    const existing = await prisma.tarif_volume_vendor.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Data not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.tarif_volume_vendor.update({
      where: { id },
      data: {
        volume_min,
        volume_max,
        biaya_perBarang,
        biaya_diskon,
        keterangan,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update data" },
      { status: 500 }
    );
  }
}

// DELETE data by ID
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    const existing = await prisma.tarif_volume_vendor.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Data not found" },
        { status: 404 }
      );
    }

    await prisma.tarif_volume_vendor.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Data deleted successfully" }
    );
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete data" },
      { status: 500 }
    );
  }
}
  