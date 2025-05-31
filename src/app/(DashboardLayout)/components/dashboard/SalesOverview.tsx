'use client';

import React, { useEffect, useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Barang {
  id: number;
  hari: string;
  tujuan: string;
  tagihan: number;
}

type Mode = 'bulan' | 'tahun';

const SalesOverview = () => {
  const [mode, setMode] = useState<Mode>('bulan');
  const [selectedTujuan, setSelectedTujuan] = useState<string>('semua');
  const [data, setData] = useState<Barang[]>([]);

  const handleModeChange = (event: any) => {
    setMode(event.target.value);
  };

  const handleTujuanChange = (event: any) => {
  setSelectedTujuan(event.target.value.toUpperCase());
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

  // Ambil daftar tujuan unik
  const tujuanList = Array.from(
  new Set(
    data
      .map((item) => item.tujuan?.trim().toUpperCase()) // normalisasi
      .filter((t) => t) // buang yang null/kosong
  )
).sort();


  // Filter data sesuai tujuan
  const filteredData =
    selectedTujuan === 'semua'
      ? data
      : data.filter((item) => item.tujuan?.trim().toUpperCase() === selectedTujuan)


  // 🔄 Agregasi berdasarkan bulan/tahun
  const aggregated: { [key: string]: number } = {};

  filteredData.forEach((item) => {
  if (!item.hari || typeof item.hari !== 'string') return; // abaikan jika null/kosong

  const parts = item.hari.split('/');
  if (parts.length !== 3) return;

  const [d, m, y] = parts.map(Number);
  if (!y || !m || isNaN(d)) return;

  const key =
    mode === 'bulan'
      ? `${y}-${String(m).padStart(2, '0')}`
      : `${y}`;

  aggregated[key] = (aggregated[key] || 0) + item.tagihan;
});

  // Ubah object menjadi array untuk chart
  const categories = Object.keys(aggregated).sort();
  const seriesData = categories.map((key) => aggregated[key]);

  const options = {
    chart: {
      type: 'bar' as const,
      toolbar: { show: false },
      foreColor: '#000',
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
        style: { colors: '#000' },
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
    formatter: (val: number) => `Rp ${val.toLocaleString('id-ID')}`,
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
      title="Statistik Penjualan"
      action={
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Select value={mode} size="small" onChange={handleModeChange}>
            <MenuItem value="bulan">Per Bulan</MenuItem>
            <MenuItem value="tahun">Per Tahun</MenuItem>
          </Select>
          <Select value={selectedTujuan} size="small" onChange={handleTujuanChange}>
            <MenuItem value="semua">Semua Tujuan</MenuItem>
            {tujuanList.map((tujuan) => (
              <MenuItem key={tujuan} value={tujuan}>
                {tujuan}
              </MenuItem>
            ))}
          </Select>
        </div>
      }
    >
      <Chart
        options={options}
        series={series}
        type="bar"
        height={370}
        width="100%"
      />
    </DashboardCard>
  );
};

export default SalesOverview;
