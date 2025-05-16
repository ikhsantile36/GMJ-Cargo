import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { user_role } from '@prisma/client';

// Method POST untuk register user
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password, role } = body;

    // Validasi input dasar
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'Username, email, dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Validasi enum role
    const allowedRoles = Object.values(user_role); // ['USER', 'ADMIN', 'SUPERADMIN']
    const validatedRole = allowedRoles.includes(role) ? (role as user_role) : user_role.USER;

    // Cek apakah user sudah ada
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email atau username sudah terdaftar' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user ke database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: validatedRole,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('❌ Error saat register:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}

// Method GET untuk mengambil daftar user
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('❌ Gagal mengambil user:', error);
    return NextResponse.json({ message: 'Gagal mengambil data user' }, { status: 500 });
  }
}
