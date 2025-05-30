'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Fab } from '@mui/material';
import { IconArrowDownRight, IconCurrencyDollar } from '@tabler/icons-react';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// ... bagian import tetap sama ...

interface Barang {
  id: number;
  hari: string; // ubah ini sesuai dengan field yang kamu pakai
  tagihan: number;
}

const MonthlyEarnings = () => {
  const [data, setData] = useState<Barang[]>([]);
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = '#f5fcff';
  const errorlight = '#fdede8';

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/barang');
      const json = await res.json();
      setData(Array.isArray(json) ? json : json.data || []);
    };
    fetchData();
  }, []);

  // Gunakan "hari" sebagai basis waktu
  const monthlyTotals: { [key: string]: number } = {};

  data.forEach((item) => {
    const [day, month, year] = item.hari.split("/").map(Number); // "2/1/2025" → [2,1,2025]
    if (!year || !month) return; // jaga-jaga kalau format salah

    const key = `${year}-${String(month).padStart(2, '0')}`; // Contoh: "2025-01"
    monthlyTotals[key] = (monthlyTotals[key] || 0) + item.tagihan;
  });

  const sortedKeys = Object.keys(monthlyTotals).sort();
  const latestMonth = sortedKeys[sortedKeys.length - 1] || '';
  const latestTotal = latestMonth ? monthlyTotals[latestMonth] : 0;

  const recentMonths = sortedKeys.slice(-5);
  const chartData = recentMonths.map((key) => Math.round(monthlyTotals[key]));

  // Chart config tetap sama
  const optionscolumnchart: any = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 60,
      sparkline: { enabled: true },
      group: 'sparklines',
    },
    stroke: { curve: 'smooth', width: 2 },
    fill: { colors: [secondarylight], type: 'solid', opacity: 0.05 },
    markers: { size: 0 },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      y: {
        formatter: (val: number) => `Rp ${val.toLocaleString('id-ID')}`,
      },
    },
  };

  const seriescolumnchart: any = [
    {
      name: 'Pendapatan',
      color: secondary,
      data: chartData,
    },
  ];

  return (
    <DashboardCard
      title="Pendapatan Bulanan"
      action={
        <Fab color="secondary" size="medium" sx={{ color: '#ffffff' }}>
          <IconCurrencyDollar width={24} />
        </Fab>
      }
      footer={
        <Chart
          options={optionscolumnchart}
          series={seriescolumnchart}
          type="area"
          height={60}
          width="100%"
        />
      }
    >
      <>
        <Typography variant="h3" fontWeight="700" mt="-20px">
          Rp {latestTotal.toLocaleString('id-ID')}
        </Typography>
        <Stack direction="row" spacing={1} my={1} alignItems="center">
          <Avatar sx={{ bgcolor: errorlight, width: 27, height: 27 }}>
            <IconArrowDownRight width={20} color="#FA896B" />
          </Avatar>
          <Typography variant="subtitle2" fontWeight="600">
            +{chartData.length >= 2 ? Math.round((chartData.at(-1)! - chartData.at(-2)!) / chartData.at(-2)! * 100) : 0}%
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            dari bulan sebelumnya
          </Typography>
        </Stack>
      </>
    </DashboardCard>
  );
};

export default MonthlyEarnings;
