'use client';

import React, { useEffect, useState } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TableContainer,
  Box,
  FormControl,
  InputLabel,
  Typography,
  SelectChangeEvent,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { format, isToday, isThisMonth, isThisYear } from 'date-fns';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const exportToExcel = (data: PengirimanItem[]) => {
  const groupedData: any[] = [];
  let currentSTT = null;

  data.forEach((item, index) => {
    const date = new Date(item.tgl);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    const row = {
      Tanggal: formattedDate,
      STT: item.stt,
      Tujuan: item.tujuan,
      Penerima: item.penerima_dan_hp,
      Pengirim: item.pengirim_dan_hp,
      Jenis: item.jenis_kiriman,
      Catatan: item.catatan,
      Koli: item.koli,
      Panjang: item.panjang,
      Lebar: item.lebar,
      Tinggi: item.tinggi,
      M3: item.m3,
      VW: item.vw,
      KG: item.kg,
      Tagihan: item.tagihan,
      Alamat: item.alamat,
    };

    // Tambahkan row
    groupedData.push(row);

    // Cek jika STT berubah di item berikutnya, tambahkan baris kosong
    const nextItem = data[index + 1];
    if (!nextItem || nextItem.stt !== item.stt) {
      groupedData.push({}); // baris kosong
    }
  });

  const worksheet = XLSX.utils.json_to_sheet(groupedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Pengiriman');

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  // Simpan ke file (contoh)
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pengiriman.xlsx';
  a.click();
  window.URL.revokeObjectURL(url);
};



type PengirimanItem = {
  id: number;
  tgl: string;
  stt: string;
  tujuan: string;
  penerima_dan_hp: string;
  pengirim_dan_hp: string;
  jenis_kiriman: string;
  catatan?: string;
  koli: number;
  panjang: number;
  lebar: number;
  tinggi: number;
  m3: number;
  vw: number;
  kg?: number;
  tagihan: number;
  alamat: string;
};

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.grey[300],
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function PengirimanTable() {
  const [allData, setAllData] = useState<PengirimanItem[]>([]);
  const [displayData, setDisplayData] = useState<PengirimanItem[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalFiltered, setTotalFiltered] = useState(0);
  const [dateFilter, setDateFilter] = useState('all');
  
  const totalPages = Math.ceil(totalFiltered / pageSize);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch('/api/barang');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        if (json.success) {
          setAllData(json.data);
        } else {
          console.error('Gagal mengambil data:', json.message);
        }
      } catch (err) {
        console.error('Gagal mengambil data:', err);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    let filtered = [...allData];

    if (dateFilter !== 'all') {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.tgl);
        if (isNaN(itemDate.getTime())) return false;
        if (dateFilter === 'today') return isToday(itemDate);
        if (dateFilter === 'thisMonth') return isThisMonth(itemDate);
        if (dateFilter === 'thisYear') return isThisYear(itemDate);
        return true;
      });
    }
         if (search) {
        const query = search.toLowerCase();
        filtered = filtered.filter(
        (item) =>
          item.pengirim_dan_hp.toLowerCase().includes(query) ||
          item.stt.toLowerCase().includes(query)
      );
    }


    filtered.sort((a, b) => {
      const sttA = Number(a.stt);
      const sttB = Number(b.stt);
      return sttA === sttB ? a.koli - b.koli : sttA - sttB;
    });

    setTotalFiltered(filtered.length);
    setDisplayData(filtered.slice((page - 1) * pageSize, page * pageSize));
  }, [allData, search, dateFilter, page, pageSize]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDateFilterChange = (e: SelectChangeEvent<string>) => {
    setDateFilter(e.target.value);
    setPage(1);
  };      

  const handleRowsPerPageChange = (e: SelectChangeEvent) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Data Pengiriman</Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            label="Cari Nama Pengirim / No. Resi (STTB)"
            value={search}
            onChange={handleSearchChange}
            fullWidth
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Filter Tanggal</InputLabel>
            <Select value={dateFilter} label="Filter Tanggal" onChange={handleDateFilterChange}>
              <MenuItem value="all">Semua</MenuItem>
              <MenuItem value="today">Hari Ini</MenuItem>
              <MenuItem value="thisMonth">Bulan Ini</MenuItem>
              <MenuItem value="thisYear">Tahun Ini</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Button onClick={() => exportToExcel(displayData)} sx={{ mb: 2 }}>Download Excel</Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableHeadCell>Tanggal</StyledTableHeadCell>
              <StyledTableHeadCell>STTB</StyledTableHeadCell>
              <StyledTableHeadCell>Tujuan</StyledTableHeadCell>
              <StyledTableHeadCell>Penerima</StyledTableHeadCell>
              <StyledTableHeadCell>Pengirim</StyledTableHeadCell>
              <StyledTableHeadCell>Jenis</StyledTableHeadCell>
              <StyledTableHeadCell>Catatan</StyledTableHeadCell>
              <StyledTableHeadCell align="right">Koli</StyledTableHeadCell>
              <StyledTableHeadCell align="right">P</StyledTableHeadCell>
              <StyledTableHeadCell align="right">L</StyledTableHeadCell>
              <StyledTableHeadCell align="right">T</StyledTableHeadCell>
              <StyledTableHeadCell align="right">M³</StyledTableHeadCell>
              <StyledTableHeadCell align="right">VW</StyledTableHeadCell>
              <StyledTableHeadCell align="right">KG</StyledTableHeadCell>
              <StyledTableHeadCell align="right">Tagihan</StyledTableHeadCell>
              <StyledTableHeadCell>Alamat</StyledTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={16} align="center">Tidak ada data ditemukan.</TableCell>
              </TableRow>
            ) : (
              displayData.map((item) => (
                <StyledTableRow key={item.id}>
                  <TableCell>{new Date(item.tgl).toLocaleDateString("id-ID", {
                      timeZone: "Asia/Jakarta",
                    })
                  }</TableCell>
                  <TableCell>{item.stt}</TableCell>
                  <TableCell>{item.tujuan}</TableCell>
                  <TableCell>{item.penerima_dan_hp}</TableCell>
                  <TableCell>{item.pengirim_dan_hp}</TableCell>
                  <TableCell>{item.jenis_kiriman}</TableCell>
                  <TableCell>{item.catatan || '-'}</TableCell>
                  <TableCell align="right">{item.koli}</TableCell>
                  <TableCell align="right">{item.panjang}</TableCell>
                  <TableCell align="right">{item.lebar}</TableCell>
                  <TableCell align="right">{item.tinggi}</TableCell>
                  <TableCell align="right">{item.m3.toFixed(3)}</TableCell>
                  <TableCell align="right">{item.vw.toFixed(2)}</TableCell>
                  <TableCell align="right">{item.kg ?? '-'}</TableCell>
                  <TableCell align="right">{item.tagihan.toLocaleString('id-ID')}</TableCell>
                  <TableCell>{item.alamat}</TableCell>
                </StyledTableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Paper sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, mt: 2 }}>
        <Typography>Halaman {page} dari {totalPages || 1} (Total {totalFiltered} item)</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl size="small">
            <InputLabel>Rows / Page</InputLabel>
            <Select value={pageSize.toString()} label="Rows / Page" onChange={handleRowsPerPageChange}>
              {[5, 10, 20, 50, 100].map((num) => (
                <MenuItem key={num} value={num}>{num}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Sebelumnya</Button>
          <Button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>Berikutnya</Button>
        </Box>
      </Paper>
    </Box>
  );
}