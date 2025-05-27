'use client';

import React, { useEffect, useState } from 'react';
import { Select, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface Pengiriman {
  id: number;
  createdAt: string;
  wilayah: string;
  jumlah_barang: number;
}

type Mode = 'bulan' | 'tahun';

const PengirimanOverview = () => {
  const [mode, setMode] = useState<Mode>('bulan');
  const [selectedWilayah, setSelectedWilayah] = useState('Semua');
  const [data, setData] = useState<Pengiriman[]>([]);
  const [wilayahList, setWilayahList] = useState<string[]>([]);

  const theme = useTheme();
  const primary = theme.palette.primary.main;

  const handleModeChange = (event: any) => {
    setMode(event.target.value);
  };

  const handleWilayahChange = (event: any) => {
    setSelectedWilayah(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/pengiriman');
      const json = await res.json();
      const dataArray = Array.isArray(json) ? json : json.data || [];
      setData(dataArray);

      // Ambil list wilayah unik
      const uniqueWilayah = Array.from(new Set(dataArray.map((item: Pengiriman) => item.wilayah))) as string[];
      setWilayahList(uniqueWilayah);
    };
    fetchData();
  }, []);

  // 🔄 Filter dan agregasi data
  const aggregated: { [key: string]: number } = {};

  data
    .filter((item) => selectedWilayah === 'Semua' || item.wilayah === selectedWilayah)
    .forEach((item) => {
      const date = new Date(item.createdAt);
      const key =
        mode === 'bulan'
          ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}` // ex: 2025-05
          : `${date.getFullYear()}`; // ex: 2025

      aggregated[key] = (aggregated[key] || 0) + item.jumlah_barang;
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
          <Select value={selectedWilayah} size="small" onChange={handleWilayahChange}>
            <MenuItem value="Semua">Semua Tujuan</MenuItem>
            {wilayahList.map((wilayah) => (
              <MenuItem key={wilayah} value={wilayah}>
                {wilayah}
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
