// scripts/createSuperAdmin.js
import bcryptjs from 'bcryptjs'; // Gunakan bcryptjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createSuperAdmin = async () => {
  try {
    // Hash password untuk superadmin
    const hashedPassword = await bcryptjs.hash('superadmin123', 10);

    // Cek apakah superadmin sudah ada
    const existing = await prisma.user.findFirst({
      where: { username: 'superadmin' },
    });

    if (!existing) {
      // Membuat user superadmin baru
      const admin = await prisma.user.create({
        data: {
          username: 'superadmin',
          email: 'superadmin@example.com',
          password: hashedPassword,
          nomor_hp: '081234567890',
          role: 'SUPERADMIN',
        },
      });

      console.log('Superadmin created:', admin);
    } else {
      console.log('Superadmin already exists');
    }
  } catch (error) {
    console.error('Error creating superadmin:', error);
  } finally {
    // Pastikan untuk menutup koneksi Prisma setelah selesai
    await prisma.$disconnect();
  }
};

createSuperAdmin();
