'use client';

import React, { useEffect, useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Barang {
  id: number;
  hari: string;     // format: dd/mm/yyyy
  tujuan: string;
}

type Mode = 'bulan' | 'tahun';

const PengirimanChart = () => {
  const [mode, setMode] = useState<Mode>('bulan');
  const [selectedTujuan, setSelectedTujuan] = useState<string>('semua');
  const [data, setData] = useState<Barang[]>([]);

  const theme = useTheme();
  const primary = theme.palette.primary.main;

  const handleModeChange = (event: any) => {
    setMode(event.target.value);
  };

  const handleTujuanChange = (event: any) => {
    setSelectedTujuan(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/barang');
      const json = await res.json();
      setData(Array.isArray(json) ? json : json.data || []);
    };
    fetchData();
  }, []);

  // Ambil list tujuan unik
  // Ambil tujuan unik (tanpa spasi dan case-insensitive)
const tujuanList = Array.from(
  new Set(data.map(item => item.tujuan.trim().toUpperCase()))
).sort();

  // Filter berdasarkan tujuan
  const filteredData = selectedTujuan === 'semua'
    ? data
    : data.filter((item) => item.tujuan === selectedTujuan);

  // Agregasi jumlah pengiriman berdasarkan bulan/tahun
  const aggregated: { [key: string]: number } = {};

  filteredData.forEach((item) => {
    if (!item.hari || typeof item.hari !== 'string') return;

    const parts = item.hari.split('/');
    if (parts.length !== 3) return;

    const [d, m, y] = parts.map(Number);
    if (!y || !m || isNaN(d)) return;

    const key = mode === 'bulan' ? `${y}-${String(m).padStart(2, '0')}` : `${y}`;
    aggregated[key] = (aggregated[key] || 0) + 1; // jumlah pengiriman = jumlah record
  });

  const categories = Object.keys(aggregated).sort();
  const seriesData = categories.map(key => aggregated[key]);

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
        style: { colors: '#000' },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} pengiriman`,
      },
    },
  };

  const series = [
    {
      name: 'Jumlah Pengiriman',
      data: seriesData,
    },
  ];

  return (
    <DashboardCard
      title="Statistik Pengiriman"
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

export default PengirimanChart;
