"use client";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Box,
  TablePagination,
} from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

export default function FormTarifVolumeVendor() {
  const [form, setForm] = useState({
    volume_min: "",
    volume_max: "",
    biaya_per_barang: "",
    biaya_per_barang_diskon: "",
    keterangan: "",
  });

  const [tarifList, setTarifList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event:any, newPage:any) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event:any) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

  useEffect(() => {
    fetchTarifData();
  }, []);

  const fetchTarifData = async () => {
    try {
      const res = await fetch("/api/tarif-volume");
      const data = await res.json();
      setTarifList(data);
    } catch (err) {
      console.error("Gagal fetch data:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/tarif-volume", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        volume_min: parseFloat(form.volume_min),
        volume_max: form.volume_max ? parseFloat(form.volume_max) : null,
        biaya_perBarang: parseFloat(form.biaya_per_barang),
        biaya_diskon: form.biaya_per_barang_diskon
          ? parseFloat(form.biaya_per_barang_diskon)
          : null,
        keterangan: form.keterangan || null,
      }),
    });

    const result = await response.json();
    if (response.ok) {
      alert("Berhasil disimpan!");
      setForm({
        volume_min: "",
        volume_max: "",
        biaya_per_barang: "",
        biaya_per_barang_diskon: "",
        keterangan: "",
      });
      fetchTarifData(); 
    } else {
      alert("Gagal menyimpan: " + (result.message || result.error));
    }
  };

  return (
    <PageContainer
      title="Input Tarif Volume Vendor"
      description="Form input Tarif Volume"
    >
      <DashboardCard title="Form Pengiriman Vendor">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Volume Min (m³)"
                name="volume_min"
                type="number"
                value={form.volume_min}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Volume Max (m³)"
                name="volume_max"
                type="number"
                value={form.volume_max}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Biaya per Barang"
                name="biaya_per_barang"
                type="number"
                value={form.biaya_per_barang}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Biaya Diskon (opsional)"
                name="biaya_per_barang_diskon"
                type="number"
                value={form.biaya_per_barang_diskon}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Keterangan (opsional)"
                name="keterangan"
                value={form.keterangan}
                onChange={handleChange}
              />
            </Grid>

        <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button type="submit" variant="contained" color="warning">
                  Simpan Data
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </DashboardCard>

      {/* Tabel List Data */}
      
      <DashboardCard title="Data Kubikasi Tarif Volume Vendor">
        {tarifList.length === 0 ? (
          <Typography variant="body1">Belum ada data.</Typography>
        ) : (
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Volume Min</TableCell>
                  <TableCell>Volume Max</TableCell>
                  <TableCell>Biaya per Barang</TableCell>
                  <TableCell>Diskon</TableCell>
                  <TableCell>Keterangan</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tarifList
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{item.volume_min}</TableCell>
                      <TableCell>{item.volume_max ?? "-"}</TableCell>
                      <TableCell>{item.biaya_perBarang}</TableCell>
                      <TableCell>{item.biaya_diskon ?? "-"}</TableCell>
                      <TableCell>{item.keterangan ?? "-"}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={tarifList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}
      </DashboardCard>
    </PageContainer>
  );
}
