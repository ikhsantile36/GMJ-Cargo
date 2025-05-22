"use client";

import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useEffect, useState } from "react";
import { Pengiriman } from "@/app/types/pengiriman";
import { useRouter } from "next/navigation";
import { Inventory } from "@/app/types/inventory"; // pastikan path benar

type InventoryStatus =
  | "sedang_dikirim"
  | "telah_diterima"
  | "butuh_validasi"
  | "telah_selesai";

type MuiColor =
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning";

const statusList: {
  key: InventoryStatus;
  label: string;
  icon: React.ReactElement;
  color: MuiColor;
}[] = [
  {
    key: "sedang_dikirim",
    label: "Sedang Dikirim",
    icon: <LocalShippingIcon />,
    color: "warning",
  },
  {
    key: "telah_diterima",
    label: "Telah Diterima",
    icon: <CheckCircleIcon />,
    color: "primary",
  },
  {
    key: "butuh_validasi",
    label: "Butuh Validasi",
    icon: <ErrorIcon />,
    color: "error",
  },
  {
    key: "telah_selesai",
    label: "Telah Selesai",
    icon: <DoneAllIcon />,
    color: "success",
  },
];

export default function InventoryPage() {
  const router = useRouter();
  const [data, setData] = useState<Pengiriman[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<InventoryStatus>("sedang_dikirim");
  const [selectedItem, setSelectedItem] = useState<Pengiriman | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [inventoryHistory, setInventoryHistory] = useState<Inventory[]>([]);

  useEffect(() => {
    fetch("/api/pengiriman")
      .then((res) => res.json())
      .then((res) => {
        console.error(res);
        const parsedData = res.map((item: any) => ({
          ...item,
          barang: Array.isArray(item.barang)
            ? item.barang
            : JSON.parse(item.barang),
        }));
        setData(parsedData);
        setLoading(false);
        console.log("datanya adalah", res);
      });
  }, []);

  const filteredData = data.filter((item) => item.status_barang === filter);

  const handleOpenDialog = async (item: Pengiriman) => {
    setSelectedItem(item);
    setOpenDialog(true);

    try {
      const res = await fetch(`/api/inventory?nomor_resi=${item.nomor_resi}`);
      const data = await res.json();
      setInventoryHistory(data);
    } catch (error) {
      console.error("Gagal memuat history:", error);
      setInventoryHistory([]);
    }
  };

  const handleCloseDialog = () => {
    setSelectedItem(null);
    setOpenDialog(false);
  };

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Manajemen Inventori Barang
      </Typography>

      <Stack direction="row" spacing={2} my={3} justifyContent="space-between">
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {statusList.map((status) => (
            <Chip
              key={status.key}
              label={status.label}
              icon={status.icon}
              color={status.key === filter ? status.color : "default"}
              variant={status.key === filter ? "filled" : "outlined"}
              onClick={() => setFilter(status.key)}
            />
          ))}
        </Stack>
      </Stack>

      {loading ? (
        <Box mt={4} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nama Pengirim</TableCell>
                <TableCell align="center">Nomor Resi</TableCell>
                <TableCell align="center">Alamat Pengiriman</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">View Detail</TableCell>
                <TableCell align="center">Update</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Tidak ada data dengan status ini.
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => {
                  const statusItem = statusList.find(
                    (s) => s.key === item.status_barang
                  );

                  return (
                    <TableRow key={item.id}>
                      <TableCell>{item.nama_pengirim}</TableCell>
                      <TableCell align="center">{item.nomor_resi}</TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          maxWidth: 200, // Batasi lebar sel
                          whiteSpace: "nowrap", // Cegah teks pindah baris
                          overflow: "hidden", // Sembunyikan kelebihan teks
                          textOverflow: "ellipsis", // Tambahkan titik-tiga
                        }}
                      >
                        {item.alamat_pengiriman}
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          icon={statusItem?.icon}
                          label={statusItem?.label || item.status_barang}
                          color={(statusItem?.color as MuiColor) || "default"}
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleOpenDialog(item)}
                        >
                          View
                        </Button>
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          color="warning"
                          onClick={() =>
                            router.push(`/inventory-barang/update/${item.id}`)
                          }
                        >
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* MODAL DETAIL */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Detail Inventori</DialogTitle>
        <DialogContent dividers>
          {selectedItem && (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>
                    <strong>Nama Pengirim:</strong> {selectedItem.nama_pengirim}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>
                    <strong>Nomor HP:</strong> {selectedItem.nomor_hp_pengirim}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>
                    <strong>jenis</strong>: {selectedItem.jenis}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>
                    <strong>Jumlah Barang:</strong> {selectedItem.jumlah_barang}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>
                    <strong>Status:</strong> {selectedItem.status_barang}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>
                    <strong>Nomor Resi:</strong>{" "}
                    {selectedItem.nomor_resi || "-"}
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ my: 1 }} />

              <Box mt={2}>
                <Typography variant="h6" gutterBottom>
                  Riwayat Lokasi Barang
                </Typography>
                {inventoryHistory.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Tidak ada histori lokasi.
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      maxHeight: 250,
                      overflowY: "auto",
                      border: "1px solid #ccc",
                      borderRadius: 2,
                      p: 2,
                      mt: 1,
                    }}
                  >
                    {inventoryHistory.map((log, index) => (
                      <Box
                        key={index}
                        sx={{
                          mb: 2,
                          p: 1.5,
                          borderBottom: "1px solid #eee",
                          backgroundColor: "#FF9800",
                          borderRadius: 1,
                        }}
                      >
                        <Typography fontWeight="bold" variant="subtitle2">
                          {new Date(log.waktu_update).toLocaleString()}
                        </Typography>
                        <Typography variant="body2">
                          Lokasi: <strong>{log.lokasi}</strong>
                        </Typography>
                        {log.keterangan && (
                          <Typography variant="body2" color="text.default">
                            Catatan: {log.keterangan}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="warning">
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
