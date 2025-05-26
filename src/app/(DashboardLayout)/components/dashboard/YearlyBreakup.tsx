'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Avatar } from '@mui/material';
import { IconArrowUpLeft } from '@tabler/icons-react';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

interface Barang {
  tgl: string;
  tagihan: number;
}

const YearlyBreakup = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = '#ecf2ff';
  const successlight = theme.palette.success.light;

  const [series, setSeries] = useState<number[]>([]);
  const [yearLabels, setYearLabels] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/barang');
      const json = await res.json();
      const data: Barang[] = Array.isArray(json) ? json : json.data || [];

      // Kelompokkan berdasarkan tahun
      const yearlyTotals: { [year: string]: number } = {};

      data.forEach((item) => {
        const year = new Date(item.tgl).getFullYear().toString();
        yearlyTotals[year] = (yearlyTotals[year] || 0) + item.tagihan;
      });

      setSeries(Object.values(yearlyTotals));
      setYearLabels(Object.keys(yearlyTotals));
    };

    fetchData();
  }, []);

  const optionscolumnchart = {
    chart: {
      type: "donut" as const,
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 155,
    },
    colors: [primary, primarylight, '#F9F9FD'],
    labels: yearLabels,
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
      y: {
        formatter: (val: number) => `Rp ${val.toLocaleString('id-ID')}`,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
        },
      },
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
  };

  return (
    <DashboardCard title="Pendatapan Tahunan">
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Typography variant="h3" fontWeight="700">
            Total: Rp {series.reduce((a, b) => a + b, 0).toLocaleString('id-ID')}
          </Typography>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
              <IconArrowUpLeft width={20} color="#39B69A" />
            </Avatar>
            <Typography variant="subtitle2" fontWeight="600">
              +{series.length > 1 ? 'Growth' : 'Data'}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              per tahun
            </Typography>
          </Stack>
          <Stack spacing={3} mt={5} direction="row">
            {yearLabels.map((year, index) => (
              <Stack direction="row" spacing={1} alignItems="center" key={year}>
                <Avatar
                  sx={{ width: 9, height: 9, bgcolor: index === 0 ? primary : primarylight }}
                ></Avatar>
                <Typography variant="subtitle2" color="textSecondary">
                  {year}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Grid>
        <Grid item xs={12} md={5}>
          <Chart
            options={optionscolumnchart}
            series={series}
            type="donut"
            height={150}
            width="100%"
          />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default YearlyBreakup;