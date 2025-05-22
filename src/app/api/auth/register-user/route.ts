import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nomorHp } = body;

    if (!nomorHp) {
      return NextResponse.json(
        { message: 'Nomor HP wajib diisi.' },
        { status: 400 }
      );
    }

    const isPhoneNumber = /^[0-9]{8,15}$/.test(nomorHp);
    if (!isPhoneNumber) {
      return NextResponse.json({ message: 'Format nomor HP tidak valid.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { nomor_hp: nomorHp },
    });

    if (!user) {
      return NextResponse.json({ message: 'Nomor HP tidak ditemukan.' }, { status: 404 });
    }

    const token = jwt.sign(
      { id: user.id, nomor_hp: user.nomor_hp, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    return NextResponse.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        nomor_hp: user.nomor_hp,
        role: user.role,
      },
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
