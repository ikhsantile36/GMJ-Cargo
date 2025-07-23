import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';
const prisma = new PrismaClient();

export const generateSTTB = async (): Promise<string> => {
  const now = new Date();
  const bulan = format(now, 'MM');
  const tahun = format(now, 'yyyy');

  // Ambil STTB tertinggi di bulan dan tahun saat ini
  const latest = await prisma.pengiriman.findFirst({
    where: {
      createdAt: {
        gte: new Date(`${tahun}-${bulan}-01T00:00:00Z`),
        lt: new Date(`${tahun}-${bulan}-31T23:59:59Z`),
      },
      sttb: {
        startsWith: bulan, // Pastikan prefix STTB-nya dari bulan ini
      },
    },
    orderBy: {
      sttb: 'desc',
    },
    select: {
      sttb: true,
    },
  });

  let nextUrutan = 1;
  if (latest?.sttb) {
    const nomor = parseInt(latest.sttb.slice(2)); // Ambil 3 digit terakhir
    nextUrutan = nomor + 1;
  }

  return `${bulan}${String(nextUrutan).padStart(3, '0')}`;
};
