import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    console.log("Menerima request...");
    const { username, email, password } = await req.json();
    console.log("Data diterima:", { username, email, password });

    // Validasi input
    if (!username || !email || !password) {
      console.log("Validasi gagal: Field kosong");
      return NextResponse.json(
        { message: "Semua field harus diisi." },
        { status: 400 }
      );
    }

    // Cek jika user sudah ada
    console.log("Memeriksa duplikat email...");
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("Email sudah digunakan");
      return NextResponse.json(
        { message: "Email sudah digunakan." },
        { status: 400 }
      );
    }

    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru
    console.log("Menyimpan user ke database...");
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    console.log("User berhasil disimpan:", user);

    return NextResponse.json(
      { message: "Registrasi berhasil", user },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Terjadi error saat registrasi:", error);
    return NextResponse.json(
      {
        message: "Gagal melakukan registrasi",
        error: error.message,
      },
      { status: 500 }
    );
  }
}