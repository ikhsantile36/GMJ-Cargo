// app/api/status/route.ts
import { NextResponse } from "next/server";
//import { StatusBarang } from "./status-barang.enum";

export async function GET() {
const values = Object.values(StatusBarang);
return NextResponse.json({ statusList: values });
}


export enum StatusBarang {
  sedang_dikirim = "sedang_dikirim",
  telah_diterima = "telah_diterima",
  butuh_validasi = "butuh_validasi",
  telah_selesai = "telah_selesai",
}