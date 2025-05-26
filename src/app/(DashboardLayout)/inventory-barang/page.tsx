"use client";

import React, { useEffect, useState } from "react";
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
  Button,
  SelectChangeEvent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { format, isToday, isThisMonth, isThisYear } from "date-fns";
import * as XLSX from "xlsx";

// Tipe data sesuai field yang digunakan di tabel
type PengirimanItem = {
  id: number;
  createdAt: string;
  sttb: string;
  wilayah: string;
  nama_penerima: string;
  nama_pengirim: string;
  jenis: string;
  catatan?: string;
  jumlah_barang: number;
  barang?: { panjang: number; lebar: number; tinggi: number }[];
  volume_rb: number;
  berat?: number;
  biaya: number;
  alamat_pengiriman?: string;
  nomor_hp_pengirim?: string;
  nomor_hp_penerima?: string;
};

const exportToExcel = (data: PengirimanItem[]) => {
  const groupedData: any[] = [];

  data.forEach((item, index) => {
    const date = new Date(item.createdAt);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const barang = item.barang?.[0] || { panjang: 0, lebar: 0, tinggi: 0 };
    const p = Number(barang.panjang);
    const l = Number(barang.lebar);
    const t = Number(barang.tinggi);
    const m3 = (p * l * t) / 1000000;
    const vw = m3 * item.volume_rb;

    const row = {
      "Tanggal": formattedDate,
      "STTB": item.sttb,
      "Tujuan": item.wilayah,
      "Penerima": item.nama_penerima,
      "Pengirim": item.nama_pengirim,
      "Jenis": item.jenis,
      "Catatan": item.catatan || "-",
      "Koli": item.jumlah_barang,
      "Panjang": p,
      "Lebar": l,
      "Tinggi": t,
      "M3": m3.toFixed(3),
      "VW": vw.toFixed(3),
      "KG": item.berat ?? "-",
      "Tagihan": item.biaya,
      "Alamat": item.alamat_pengiriman ?? "-",
      "HP Pengirim": item.nomor_hp_pengirim ?? "-",
      "HP Penerima": item.nomor_hp_penerima ?? "-",
    };

    groupedData.push(row);

    // Tambahkan baris kosong jika STTB berubah di item berikutnya
    const nextItem = data[index + 1];
    if (!nextItem || nextItem.sttb !== item.sttb) {
      groupedData.push({});
    }
  });

  const worksheet = XLSX.utils.json_to_sheet(groupedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Pengiriman");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "pengiriman.xlsx";
  a.click();
  window.URL.revokeObjectURL(url);
};

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[200],
  fontWeight: "bold",
  whiteSpace: "nowrap",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.grey[300],
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function PengirimanTable() {
  const [allData, setAllData] = useState<PengirimanItem[]>([]);
  const [displayData, setDisplayData] = useState<PengirimanItem[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalFiltered, setTotalFiltered] = useState(0);
  const [dateFilter, setDateFilter] = useState("all");

  const totalPages = Math.ceil(totalFiltered / pageSize);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch("/api/barang");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        if (json.success) {
          setAllData(json.data);
        } else {
          console.error("Gagal mengambil data:", json.message);
          setAllData([]);
        }
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        setAllData([]);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    let filtered = [...allData];

    // Filter tanggal
    if (dateFilter !== "all") {
      filtered = filtered.filter((item: PengirimanItem) => {
        try {
          const itemDate = new Date(item.createdAt);
          if (isNaN(itemDate.getTime())) return false;
          if (dateFilter === "today") return isToday(itemDate);
          if (dateFilter === "thisMonth") return isThisMonth(itemDate);
          if (dateFilter === "thisYear") return isThisYear(itemDate);
          return true;
        } catch (e) {
          console.warn(
            `Invalid date format for item ID ${item.id}: ${item.createdAt}`
          );
          return false;
        }
      });
    }

    // Filter pencarian
    if (search) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.nama_pengirim?.toLowerCase().includes(query) ||
          item.sttb?.toLowerCase().includes(query)
      );
    }

    setTotalFiltered(filtered.length);

    // Paginasi
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);
    setDisplayData(paginated);
  }, [allData, search, dateFilter, page, pageSize]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
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
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ mb: 2, fontWeight: "medium" }}
      >
        Data Pengiriman
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
          alignItems: "center",
          mb: 2,
        }}
      >
        <TextField
          label="Cari Nama Pengirim / No. Resi (STTB)"
          value={search}
          onChange={handleSearchChange}
          fullWidth
        />
        <FormControl
          variant="outlined"
          sx={{ minWidth: 200, width: { xs: "100%", md: "auto" } }}
        >
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

      <Button onClick={() => exportToExcel(displayData)} sx={{ mb: 2 }}>
        Download Excel
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>TGL & WAKTU</TableCell>
              <TableCell>STTB</TableCell>
              <TableCell>TUJUAN</TableCell>
              <TableCell>PENERIMA</TableCell>
              <TableCell>PENGIRIM</TableCell>
              <TableCell>JENIS</TableCell>
              <TableCell>CATATAN</TableCell>
              <TableCell align="right">KOLI</TableCell>
              <TableCell align="right">P (cm)</TableCell>
              <TableCell align="right">L (cm)</TableCell>
              <TableCell align="right">T (cm)</TableCell>
              <TableCell align="right">M³</TableCell>
              <TableCell align="right">VW (Kg)</TableCell>
              <TableCell align="right">KG</TableCell>
              <TableCell align="right">TAGIHAN (Rp)</TableCell>
              <TableCell>ALAMAT / HP / KET</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {displayData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={16} align="center">
                  Tidak ada data ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              displayData.map((item) => {
                const barang = item.barang?.[0] || {
                  panjang: 0,
                  lebar: 0,
                  tinggi: 0,
                };
                const p = Number(barang.panjang);
                const l = Number(barang.lebar);
                const t = Number(barang.tinggi);
                const m3 = (p * l * t) / 1000000;

                let formattedDate = "Tanggal Invalid";
                try {
                  formattedDate = format(
                    new Date(item.createdAt),
                    "dd/MM/yyyy"
                  );
                } catch (e) {
                  console.warn(
                    `Invalid date format for item ID ${item.id}: ${item.createdAt}`
                  );
                }

                return (
                  <TableRow key={item.id}>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {formattedDate}
                    </TableCell>
                    <TableCell>{item.sttb}</TableCell>
                    <TableCell>{item.wilayah}</TableCell>
                    <TableCell>{item.nama_penerima}</TableCell>
                    <TableCell>{item.nama_pengirim}</TableCell>
                    <TableCell>{item.jenis}</TableCell>
                    <TableCell>{item.catatan || "-"}</TableCell>
                    <TableCell align="right">{item.jumlah_barang}</TableCell>
                    <TableCell align="right">{p}</TableCell>
                    <TableCell align="right">{l}</TableCell>
                    <TableCell align="right">{t}</TableCell>
                    <TableCell align="right">{m3.toFixed(3)}</TableCell>
                    <TableCell align="right">
                      {(m3 * item.volume_rb).toFixed(3)}
                    </TableCell>
                    <TableCell align="right">{item.berat ?? "-"}</TableCell>
                    <TableCell align="right">
                      {item.biaya.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell sx={{ minWidth: 250 }}>
                      {item.alamat_pengiriman && (
                        <div>Alamat: {item.alamat_pengiriman}</div>
                      )}
                      {item.nomor_hp_pengirim && (
                        <div>Pengirim HP: {item.nomor_hp_pengirim}</div>
                      )}
                      {item.nomor_hp_penerima && (
                        <div>Penerima HP: {item.nomor_hp_penerima}</div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {displayData.length > 0 && (
        <Paper
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            mt: 2,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography variant="body2">
            Halaman {page} dari {totalPages || 1} (Total {totalFiltered} item)
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
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