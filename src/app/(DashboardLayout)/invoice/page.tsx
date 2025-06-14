"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Button,
  TextField,
  Pagination,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface Pengiriman {
  id: string;
  sttb: string;
  nama_pengirim: string;
  wilayah: string;
  createdAt: string;
}

export default function InvoiceListPage() {
  const [data, setData] = useState<Pengiriman[]>([]);
  const [filteredData, setFilteredData] = useState<Pengiriman[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch("/api/pengiriman")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setFilteredData(res);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = data.filter((item) =>
      item.sttb.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // reset ke halaman 1 saat pencarian
  }, [search, data]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Daftar Invoice Pengiriman
      </Typography>

      <Box mb={2}>
        <TextField
          label="Cari STTB"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      <Paper sx={{ overflowX: "auto", my: 4 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>STTB</TableCell>
              <TableCell>Pengirim</TableCell>
              <TableCell>Wilayah</TableCell>
              <TableCell>Tanggal Dibuat</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{item.sttb}</TableCell>
                <TableCell>{item.nama_pengirim}</TableCell>
                <TableCell>{item.wilayah}</TableCell>
                <TableCell>
                  {new Date(item.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Link href={`/invoice/${item.id}`} passHref>
                    <Button startIcon={<VisibilityIcon />}>Lihat Invoice</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Tidak ada data ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      {filteredData.length > itemsPerPage && (
        <Box display="flex" justifyContent="center" my={2}>
          <Pagination
            count={Math.ceil(filteredData.length / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}
