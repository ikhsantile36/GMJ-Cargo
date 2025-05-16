"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";

const SamplePage = () => {
  const [formData, setFormData] = useState({
    jenis: "",
    wilayah: "",
    benda_ringan_rb: "",
    benda_berat_rb: "",
    volume_rb: "",
    cost_minimum: "",
    estimasi: "",
  });

  const [data, setData] = useState<any[]>([]); // Data dari backend

  const fetchData = async () => {
    try {
      const res = await fetch("/api/tarif_wilayah");
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/tarif_wilayah", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          benda_ringan_rb: Number(formData.benda_ringan_rb),
          benda_berat_rb: Number(formData.benda_berat_rb),
          volume_rb: Number(formData.volume_rb),
          cost_minimum: Number(formData.cost_minimum),
        }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");
      alert("Data berhasil disimpan!");
      setFormData({
        jenis: "",
        wilayah: "",
        benda_ringan_rb: "",
        benda_berat_rb: "",
        volume_rb: "",
        cost_minimum: "",
        estimasi: "",
      });
      fetchData(); // refresh tabel
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan data.");
      console.error(error);
    }
  };

  return (
    <PageContainer
      title="Input Tarif Pengiriman"
      description="Form input data pengiriman"
    >
      <DashboardCard title="Form Tarif Pengiriman">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="jenis-label">Jenis</InputLabel>
                <Select
                  labelId="jenis-label"
                  name="jenis"
                  value={formData.jenis}
                  onChange={handleSelectChange}
                  label="Jenis"
                >
                  <MenuItem value="biasa">Biasa</MenuItem>
                  <MenuItem value="vendor">Vendor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Wilayah"
                name="wilayah"
                value={formData.wilayah}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Benda Ringan (rb)"
                name="benda_ringan_rb"
                type="number"
                value={formData.benda_ringan_rb}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Benda Berat (rb)"
                name="benda_berat_rb"
                type="number"
                value={formData.benda_berat_rb}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Harga Volume (rb)"
                name="volume_rb"
                type="number"
                value={formData.volume_rb}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Cost Minimum"
                name="cost_minimum"
                type="number"
                value={formData.cost_minimum}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Estimasi (misal: 3 Hari)"
                name="estimasi"
                value={formData.estimasi}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button type="submit" variant="contained" color="primary">
                  Simpan Data
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </DashboardCard>

      {/* Tabel Hasil Data */}
      <DashboardCard title="Data Tarif Wilayah">
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Jenis</TableCell>
                <TableCell>Wilayah</TableCell>
                <TableCell align="right">Ringan (rb)</TableCell>
                <TableCell align="right">Berat (rb)</TableCell>
                <TableCell align="right">Volume (rb)</TableCell>
                <TableCell align="right">Minimum (rb)</TableCell>
                <TableCell>Estimasi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.jenis}</TableCell>
                  <TableCell>{row.wilayah}</TableCell>
                  <TableCell align="right">{row.benda_ringan_rb}</TableCell>
                  <TableCell align="right">{row.benda_berat_rb}</TableCell>
                  <TableCell align="right">{row.volume_rb}</TableCell>
                  <TableCell align="right">{row.cost_minimum}</TableCell>
                  <TableCell>{row.estimasi}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </DashboardCard>
    </PageContainer>
  );
};

export default SamplePage;
