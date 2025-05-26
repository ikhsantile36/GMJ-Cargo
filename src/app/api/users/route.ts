import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { user_role } from '@prisma/client';

// CREATE user (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, nomor_hp, password, role } = body;

    if (!username || !email || !password || !nomor_hp) {
      return NextResponse.json(
        { message: 'Username, email, nomor HP, dan password wajib diisi' },
        { status: 400 }
      );
    }

    const allowedRoles = Object.values(user_role);
    const validatedRole = allowedRoles.includes(role) ? (role as user_role) : user_role.USER;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email atau username sudah terdaftar' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        nomor_hp,
        password: hashedPassword,
        role: validatedRole,
      },
      select: {
        id: true,
        username: true,
        email: true,
        nomor_hp: true,
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

// READ all users (GET)
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        nomor_hp: true,
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

// UPDATE user (PUT)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, username, email, nomor_hp, password, role } = body;

    if (!id) {
      return NextResponse.json({ message: 'ID wajib disediakan' }, { status: 400 });
    }

    const updateData: any = {
      username,
      email,
      nomor_hp,
      role,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        nomor_hp: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('❌ Gagal update user:', error);
    return NextResponse.json({ message: 'Gagal update user' }, { status: 500 });
  }
}

// DELETE user (DELETE)
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ message: 'ID wajib disediakan' }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'User berhasil dihapus' });
  } catch (error) {
    console.error('❌ Gagal hapus user:', error);
    return NextResponse.json({ message: 'Gagal hapus user' }, { status: 500 });
  }
}
