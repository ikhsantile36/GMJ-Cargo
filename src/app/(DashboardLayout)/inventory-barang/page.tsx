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
  Button,
  Paper,
  TableContainer,
  Box,
  FormControl,
  InputLabel,
  Typography,
  SelectChangeEvent // Correctly imported for Select's onChange event
} from '@mui/material';
import { styled } from '@mui/material/styles'; // Correct for custom styling
import { format, isToday, isThisMonth, isThisYear } from 'date-fns';

const PAGE_SIZE = 10;

type Barang = {
  panjang: number;
  lebar: number;
  tinggi: number;
};

type PengirimanItem = {
  id: string | number;
  createdAt: string; // Assumed to be an ISO Date string or compatible timestamp
  sttb: string;
  wilayah: string;
  nama_penerima: string;
  nama_pengirim: string;
  jenis: string;
  catatan?: string;
  jumlah_barang: number;
  barang?: Barang[];
  volume_rb: number;
  berat?: number;
  biaya: number;
  alamat_pengiriman?: string;
  nomor_hp_pengirim?: string;
  nomor_hp_penerima?: string;
};

// Styling for TableCell in Header
const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
}));

// Styling for TableRow with zebra striping and hover
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
  const [totalFiltered, setTotalFiltered] = useState(0);
  const [dateFilter, setDateFilter] = useState('all');

  const totalPages = Math.ceil(totalFiltered / PAGE_SIZE);

  // Fetch data awal sekali saja
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch('/api/barang'); // This will call your Next.js API route
        if (!res.ok) { // Added a check for response status
          throw new Error(`HTTP error! status: ${res.status}`);

        }
        const json = await res.json();
        if (json.success) {
          setAllData(json.data);
        } else {
          console.error('Gagal mengambil data:', json.message);
          setAllData([]);
        }
      } catch (err) {
        console.error('Gagal mengambil data:', err);
        setAllData([]); // Ensure state is reset on error
      }
    };
    fetchInitialData();
  }, []);

  // Efek untuk memproses data ketika allData, search, dateFilter, atau page berubah
  useEffect(() => {
    let processedData = [...allData];

    // 1. Terapkan Filter Tanggal
    if (dateFilter !== 'all') {
      processedData = processedData.filter((item: PengirimanItem) => {
        try {
          const itemDate = new Date(item.createdAt);
          if (isNaN(itemDate.getTime())) return false;

          if (dateFilter === 'today') return isToday(itemDate);
          if (dateFilter === 'thisMonth') return isThisMonth(itemDate);
          if (dateFilter === 'thisYear') return isThisYear(itemDate);
          return true; // Should not be reached if dateFilter is one of the above
        } catch (e) {
          console.warn(`Invalid date format for item ID ${item.id}: ${item.createdAt}`);
          return false;
        }
      });
    }

    // 2. Terapkan Filter Pencarian
    if (search) {
      const q = search.toLowerCase();
      processedData = processedData.filter(
        (item: PengirimanItem) =>
          item.nama_pengirim.toLowerCase().includes(q) ||
          item.sttb.toLowerCase().includes(q)
      );
    }

    setTotalFiltered(processedData.length);

    // 3. Paginasi
    const start = (page - 1) * PAGE_SIZE;
    const paginated = processedData.slice(start, start + PAGE_SIZE);
    setDisplayData(paginated);

  }, [allData, search, dateFilter, page]);


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleDateFilterChange = (event: SelectChangeEvent<string>) => {
    setDateFilter(event.target.value);
    setPage(1);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 'medium' }}>
        Data Pengiriman
      </Typography>
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, boxShadow: 1 }}> {/* Subtle shadow for filter Paper */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: 'center', mb: 2 }}>
          <TextField
            label="Cari Nama Pengirim / No. Resi (STTB)"
            variant="outlined"
            value={search}
            onChange={handleSearchChange}
            fullWidth
            sx={{ maxWidth: { md: 400 } }}
          />
          <FormControl variant="outlined" sx={{ minWidth: 200, width: { xs: '100%', md: 'auto'} }}>
            <InputLabel id="date-filter-label">Filter Tanggal</InputLabel>
            <Select
              labelId="date-filter-label"
              value={dateFilter}
              label="Filter Tanggal"
              onChange={handleDateFilterChange}
            >
              <MenuItem value="all">Semua</MenuItem>
              <MenuItem value="today">Hari Ini</MenuItem>
              <MenuItem value="thisMonth">Bulan Ini</MenuItem>
              <MenuItem value="thisYear">Tahun Ini</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table sx={{ minWidth: 1200 }} aria-label="tabel pengiriman detail">
          <TableHead>
            <TableRow>
              <StyledTableHeadCell>TGL & WAKTU</StyledTableHeadCell>
              <StyledTableHeadCell>STTB</StyledTableHeadCell>
              <StyledTableHeadCell>TUJUAN</StyledTableHeadCell>
              <StyledTableHeadCell>PENERIMA</StyledTableHeadCell>
              <StyledTableHeadCell>PENGIRIM</StyledTableHeadCell>
              <StyledTableHeadCell>JENIS</StyledTableHeadCell>
              <StyledTableHeadCell>CATATAN</StyledTableHeadCell>
              <StyledTableHeadCell align="right">KOLI</StyledTableHeadCell>
              <StyledTableHeadCell align="right">P (cm)</StyledTableHeadCell> {/* Added units for clarity */}
              <StyledTableHeadCell align="right">L (cm)</StyledTableHeadCell> {/* Added units for clarity */}
              <StyledTableHeadCell align="right">T (cm)</StyledTableHeadCell> {/* Added units for clarity */}
              <StyledTableHeadCell align="right">M³</StyledTableHeadCell>    {/* More common symbol */}
              <StyledTableHeadCell align="right">VW (Kg)</StyledTableHeadCell> {/* Added units for clarity */}
              <StyledTableHeadCell align="right">KG</StyledTableHeadCell>
              <StyledTableHeadCell align="right">TAGIHAN (Rp)</StyledTableHeadCell>
              <StyledTableHeadCell>ALAMAT / HP / KET</StyledTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={16} align="center" sx={{ py: 4 }}>
                  Tidak ada data yang sesuai dengan filter.
                </TableCell>
              </TableRow>
            ) : (
              displayData.map((item) => {
                const barang = item.barang?.[0] || { panjang: 0, lebar: 0, tinggi: 0 };
                const p = Number(barang.panjang);
                const l = Number(barang.lebar);
                const t = Number(barang.tinggi);
                const m3 = (p * l * t) / 1000000; // Assuming p, l, t are in cm for m³ calculation
                let formattedDate = 'Tanggal Invalid';
                try {
                  formattedDate = format(new Date(item.createdAt), 'dd/MM/yyyy');
                } catch (e) {
                   console.warn(`Invalid date format for item ID ${item.id}: ${item.createdAt}`);

                }

                return (
                  <StyledTableRow key={item.id}>
                    <TableCell sx={{whiteSpace: 'nowrap'}}>{formattedDate}</TableCell>
                    <TableCell>{item.sttb}</TableCell>
                    <TableCell>{item.wilayah}</TableCell>
                    <TableCell>{item.nama_penerima}</TableCell>
                    <TableCell>{item.nama_pengirim}</TableCell>
                    <TableCell>{item.jenis}</TableCell>
                    <TableCell>{item.catatan || '-'}</TableCell>
                    <TableCell align="right">{item.jumlah_barang}</TableCell>
                    <TableCell align="right">{p}</TableCell>
                    <TableCell align="right">{l}</TableCell>
                    <TableCell align="right">{t}</TableCell>
                    <TableCell align="right">{m3.toFixed(3)}</TableCell>
                    <TableCell align="right">{(m3 * item.volume_rb).toFixed(3)}</TableCell>
                    <TableCell align="right">{item.berat ?? '-'}</TableCell>
                    <TableCell align="right">{item.biaya.toLocaleString('id-ID')}</TableCell>
                    <TableCell sx={{minWidth: 250, '& > div': { marginBottom: '4px' } }}> {/* Minor style tweak for spacing */}
                      {item.alamat_pengiriman && <div>Alamat: {item.alamat_pengiriman}</div>}
                      {item.nomor_hp_pengirim && <div>Pengirim HP: {item.nomor_hp_pengirim}</div>}
                      {item.nomor_hp_penerima && <div>Penerima HP: {item.nomor_hp_penerima}</div>}
                    </TableCell>
                  </StyledTableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {displayData.length > 0 && (
        <Paper sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, mt: 2, borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="body2">
            Halaman {page} dari {totalPages || 1} (Total {totalFiltered} item)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outlined"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(page + 1)}
            >
              Berikutnya
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}