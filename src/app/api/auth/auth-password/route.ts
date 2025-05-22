import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const nomorHp = searchParams.get('nomorHp');

    if (!nomorHp) {
      return NextResponse.json({ message: 'Nomor HP tidak ditemukan di URL.' }, { status: 400 });
    }

    const { password, confirmPassword } = await req.json();

    if (!password || !confirmPassword) {
      return NextResponse.json({ message: 'Password dan konfirmasi wajib diisi.' }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ message: 'Konfirmasi password tidak cocok.' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: 'Password minimal 6 karakter.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { nomor_hp: nomorHp },
    });

    if (!user) {
      return NextResponse.json({ message: 'User tidak ditemukan.' }, { status: 404 });
    }

    if (user.password) {
      return NextResponse.json({ message: 'Password sudah pernah dibuat. Silakan login.' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed },
    });

    return NextResponse.json({ message: 'Password berhasil dibuat. Silakan login.' });
  } catch (error) {
    console.error('Set password error:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan di server.' }, { status: 500 });
  }
}
