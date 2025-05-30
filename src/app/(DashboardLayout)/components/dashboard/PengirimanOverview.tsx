'use client';

import React, { useEffect, useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Pengiriman {
  id: number;
  hari: string; // format: 'd/m/yyyy'
  tujuan: string;
  jumlah_barang: number;
}

type Mode = 'bulan' | 'tahun';

const PengirimanOverview = () => {
  const [mode, setMode] = useState<Mode>('bulan');
  const [selectedtujuan, setSelectedtujuan] = useState('Semua');
  const [data, setData] = useState<Pengiriman[]>([]);
  const [tujuanList, settujuanList] = useState<string[]>([]);

  const theme = useTheme();
  const primary = theme.palette.primary.main;

  const handleModeChange = (event: any) => {
    setMode(event.target.value);
  };

  const handletujuanChange = (event: any) => {
    setSelectedtujuan(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/barang'); // ganti endpoint sesuai sumber data
      const json = await res.json();
      const dataArray = Array.isArray(json) ? json : json.data || [];
      setData(dataArray);

      const uniquetujuan = Array.from(
        new Set(dataArray.map((item: Pengiriman) => item.tujuan))
      ) as string[];
      settujuanList(uniquetujuan);
    };
    fetchData();
  }, []);

  const aggregated: { [key: string]: number } = {};

  data
    .filter((item) => selectedtujuan === 'Semua' || item.tujuan === selectedtujuan)
    .forEach((item) => {
      if (!item.hari || typeof item.hari !== 'string') return;

      const parts = item.hari.split('/');
      if (parts.length !== 3) return;

      const [d, m, y] = parts.map(Number);
      if (!y || !m || isNaN(d)) return;

      const key = mode === 'bulan'
        ? `${y}-${String(m).padStart(2, '0')}` // contoh: 2025-01
        : `${y}`; // contoh: 2025

      aggregated[key] = (aggregated[key] || 0) + 1;
    });

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
        style: { colors: '#000' },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} barang`,
      },
    },
  };

  const series = [
    {
      name: 'Total Barang',
      data: seriesData,
    },
  ];

  return (
    <DashboardCard
      title="Statistik Pengiriman"
      action={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Select value={mode} size="small" onChange={handleModeChange}>
            <MenuItem value="bulan">Per Bulan</MenuItem>
            <MenuItem value="tahun">Per Tahun</MenuItem>
          </Select>
          <Select value={selectedtujuan} size="small" onChange={handletujuanChange}>
            <MenuItem value="Semua">Semua Tujuan</MenuItem>
            {tujuanList.map((tujuan) => (
              <MenuItem key={tujuan} value={tujuan}>
                {tujuan}
              </MenuItem>
            ))}
          </Select>
        </div>
      }
    >
      <Chart options={options} series={series} type="bar" height={370} width="100%" />
    </DashboardCard>
  );
};

export default PengirimanOverview;
