import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

interface UserResponse {
  id: string;
  nomor_hp: string;
  role: string;
}

interface SuccessResponse {
  message: string;
  token: string;
  user: UserResponse;
}

interface ErrorResponse {
  message: string;
  error?: string;
  details?: any;
}

export async function POST(req: Request): Promise<NextResponse<SuccessResponse | ErrorResponse>> {
  try {
    // 1. Parse request body
    const body = await req.json();
    const { nomorHp } = body;

    // 2. Validasi manual
    if (!nomorHp) {
      return NextResponse.json(
        { message: "Nomor HP wajib diisi" },
        { status: 400 }
      );
    }

    if (typeof nomorHp !== 'string') {
      return NextResponse.json(
        { message: "Nomor HP harus berupa string" },
        { status: 400 }
      );
    }

    if (nomorHp.length < 8 || nomorHp.length > 15) {
      return NextResponse.json(
        { message: "Nomor HP harus 8-15 digit" },
        { status: 400 }
      );
    }

    if (!/^[0-9]+$/.test(nomorHp)) {
      return NextResponse.json(
        { message: "Nomor HP hanya boleh berisi angka" },
        { status: 400 }
      );
    }

    // 3. Cek keberadaan user
    const user = await prisma.user.findUnique({
      where: { nomor_hp: nomorHp },
      select: {
        id: true,
        nomor_hp: true,
        role: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { message: "Nomor HP tidak terdaftar" },
        { status: 404 }
      );
    }

    // 4. Validasi JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET belum dikonfigurasi");
      throw new Error("Server misconfiguration");
    }

    // 5. Generate token
    const token = jwt.sign(
      {
        id: user.id,
        nomor_hp: user.nomor_hp,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 6. Response sukses
    return NextResponse.json({
      message: "Autentikasi berhasil",
      token,
      user
    });

  } catch (error) {
    // 7. Error handling
    console.error("[AUTH_ERROR]", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return NextResponse.json(
      {
        message: "Terjadi kesalahan server",
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}