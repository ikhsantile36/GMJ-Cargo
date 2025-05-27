// /app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, nomorHp, password } = body;

    if (!password || (!username && !nomorHp)) {
      return NextResponse.json(
        { message: 'Username atau nomor HP dan password wajib diisi.' },
        { status: 400 }
      );
    }

    // Tentukan field pencarian: username atau nomor_hp
    const where = username
      ? { username }
      : { nomor_hp: nomorHp };

    const user = await prisma.user.findUnique({ where });

    if (!user) {
      return NextResponse.json(
        { message: 'Akun tidak ditemukan.' },
        { status: 404 }
      );
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Password salah.' }, { status: 401 });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        nomor_hp: user.nomor_hp,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Login berhasil',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        message: 'Terjadi kesalahan saat login',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized: Token tidak ditemukan' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ message: 'Token tidak valid' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        nomor_hp: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('❌ Gagal ambil profil login:', error);
    return NextResponse.json({ message: 'Gagal ambil data' }, { status: 500 });
  }
}