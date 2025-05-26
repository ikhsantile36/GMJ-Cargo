'use client';

import React, { useEffect, useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Barang {
  id: number;
  tgl: string;
  tujuan: string;
  tagihan: number;
}

type Mode = 'bulan' | 'tahun';

const SalesOverview = () => {
  const [mode, setMode] = useState<Mode>('bulan');
  const [data, setData] = useState<Barang[]>([]);

  const handleChange = (event: any) => {
    setMode(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/barang');
      const json = await res.json();
      setData(Array.isArray(json) ? json : json.data || []);
    };
    fetchData();
  }, []);

  const theme = useTheme();
  const primary = theme.palette.primary.main;

  // 🔄 Agregasi berdasarkan bulan/tahun
  const aggregated: { [key: string]: number } = {};

  data.forEach((item) => {
    const date = new Date(item.tgl);
    const key =
      mode === 'bulan'
        ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}` // ex: 2025-05
        : `${date.getFullYear()}`; // ex: 2025

    aggregated[key] = (aggregated[key] || 0) + item.tagihan;
  });

  // Ubah object menjadi array untuk chart
  const categories = Object.keys(aggregated).sort();
  const seriesData = categories.map((key) => aggregated[key]);

  const options = {
    chart: {
      type: 'bar' as const,
      toolbar: { show: false },
      foreColor: '#000', // warna hitam untuk semua teks chart
    },
    colors: [primary],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '8%',
        borderRadius: 4,
      },
    },
    xaxis: {
      categories,
      labels: {
        style: { colors: '#000' }, // warna label sumbu X
        rotate: -45,
        formatter: (val: string | number) => {
          if (mode === 'bulan') {
            const [year, month] = String(val).split('-');
            return `${month}/${year}`;
          }
          return String(val);
        },
      },
    },
    yaxis: {
      labels: {
        style: { colors: '#000' }, // warna label sumbu Y
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `Rp ${val.toLocaleString('id-ID')}`,
      },
    },
  };

  const series = [
    {
      name: 'Total Pendapatan',
      data: seriesData,
    },
  ];

  return (
    <DashboardCard
      title="Sales Overview"
      action={
        <Select value={mode} size="small" onChange={handleChange}>
          <MenuItem value="bulan">Per Bulan</MenuItem>
          <MenuItem value="tahun">Per Tahun</MenuItem>
        </Select>
      }
    >
      <Chart options={options} series={series} type="bar" height={370} width="100%" />
    </DashboardCard>
  );
};

export default SalesOverview;