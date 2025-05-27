// app/api/status/route.ts
import { NextResponse } from "next/server";
import { StatusBarang } from "./status-barang.enum";

export async function GET() {
const values = Object.values(StatusBarang);
return NextResponse.json({ statusList: values });
}