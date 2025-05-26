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
  TablePagination,
  IconButton,
} from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import React from "react";

const SamplePage = () => {
  const [formData, setFormData] = useState<any>({
    jenis: "",
    wilayah: "",
    benda_ringan_rb: "",
    benda_berat_rb: "",
    volume_rb: "",
    cost_minimum: "",
    estimasi: "",
  });

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      benda_ringan_rb: Number(formData.benda_ringan_rb),
      benda_berat_rb: Number(formData.benda_berat_rb),
      volume_rb: Number(formData.volume_rb),
      cost_minimum: Number(formData.cost_minimum),
    };

    try {
      let res;
      if (formData.id) {
        // UPDATE
        res = await fetch("/api/tarif_wilayah", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // CREATE
        res = await fetch("/api/tarif_wilayah", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("Gagal menyimpan data");
      alert(formData.id ? "Data berhasil diperbarui!" : "Data berhasil disimpan!");
      resetForm();
      fetchData();
    } catch (error) {
      alert("Terjadi kesalahan saat menyimpan data.");
      console.error(error);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      id: item.id,
      jenis: item.jenis,
      wilayah: item.wilayah,
      benda_ringan_rb: item.benda_ringan_rb,
      benda_berat_rb: item.benda_berat_rb,
      volume_rb: item.volume_rb,
      cost_minimum: item.cost_minimum,
      estimasi: item.estimasi,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    try {
      const res = await fetch("/api/tarif_wilayah", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Gagal menghapus data");
      alert("Data berhasil dihapus!");
      fetchData();
    } catch (error) {
      alert("Terjadi kesalahan saat menghapus data.");
      console.error(error);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      jenis: "",
      wilayah: "",
      benda_ringan_rb: "",
      benda_berat_rb: "",
      volume_rb: "",
      cost_minimum: "",
      estimasi: "",
    });
  };

  return (
    <PageContainer title="Input Tarif Pengiriman" description="Form input data pengiriman">
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
              <Box display="flex" justifyContent="space-between">
                <Button type="submit" variant="contained" color="warning">
                  {formData.id ? "Update Data" : "Simpan Data"}
                </Button>
                {formData.id && (
                  <Button variant="outlined" color="secondary" onClick={resetForm}>
                    Batal Edit
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </form>
      </DashboardCard>

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
                <TableCell align="center">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.jenis}</TableCell>
                  <TableCell>{row.wilayah}</TableCell>
                  <TableCell align="right">{row.benda_ringan_rb}</TableCell>
                  <TableCell align="right">{row.benda_berat_rb}</TableCell>
                  <TableCell align="right">{row.volume_rb}</TableCell>
                  <TableCell align="right">{row.cost_minimum}</TableCell>
                  <TableCell>{row.estimasi}</TableCell>
                  <TableCell align="center">
                      <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleEdit(row)}
                          
                        >
                          Edit
                        </Button>{" "}
                        <Button
                          size="small"
                          variant="contained"
                          color="warning"
                          sx={{ ml: 1 }}
                          onClick={() => handleDelete(row.id)}
                        >
                          Delete
                        </Button>
                  </TableCell>  
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </DashboardCard>
    </PageContainer>
  );
};

export default SamplePage;
