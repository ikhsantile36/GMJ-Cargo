import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';
const prisma = new PrismaClient();

export const generateSTTB = async (): Promise<string> => {
  const now = new Date();
  const bulan = format(now, 'MM');
  const tahun = format(now, 'yyyy');

  const count = await prisma.pengiriman.count({
    where: {
      createdAt: {
        gte: new Date(`${tahun}-${bulan}-01T00:00:00Z`),
        lt: new Date(`${tahun}-${bulan}-31T23:59:59Z`),
      },
    },
  });

  const urutan = count + 1;
  return `${bulan}${String(urutan).padStart(3, '0')}`;
};