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
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useEffect, useState } from "react";
import { InventoryItem } from "@/app/types/inventory";

type InventoryStatus =
  | "sedang dikirim"
  | "telah diterima"
  | "butuh validasi"
  | "telah selesai";

type MuiColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

const statusList: {
  key: string;
  label: string;
  icon: React.ReactElement;
  color: MuiColor;
}[] = [
  { key: 'sedang_dikirim', label: 'Sedang Dikirim', icon: <LocalShippingIcon />, color: 'info' },
  { key: 'telah_diterima', label: 'Telah Diterima', icon: <CheckCircleIcon />, color: 'success' },
  { key: 'butuh_validasi', label: 'Butuh Validasi', icon: <ErrorIcon />, color: 'warning' },
  { key: 'telah_selesai', label: 'Telah Selesai', icon: <DoneAllIcon />, color: 'default' },
];

const statusConfig: Record<
  InventoryStatus,
  {
    color: "info" | "success" | "warning" | "default";
    icon: React.ReactElement;
  }
> = {
  "sedang dikirim": { color: "info", icon: <LocalShippingIcon /> },
  "telah diterima": { color: "success", icon: <CheckCircleIcon /> },
  "butuh validasi": { color: "warning", icon: <ErrorIcon /> },
  "telah selesai": { color: "default", icon: <DoneAllIcon /> },
};

// Fungsi untuk mengubah enum Prisma menjadi label readable
const formatStatus = (status: string): InventoryStatus => {
  switch (status) {
    case "sedang_dikirim":
      return "sedang dikirim";
    case "telah_diterima":
      return "telah diterima";
    case "butuh_validasi":
      return "butuh validasi";
    case "telah_selesai":
      return "telah selesai";
    default:
      return "butuh validasi";
  }
};

export default function InventoryPage() {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<InventoryStatus>("sedang dikirim");

  useEffect(() => {
    fetch("/api/pengiriman")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredData = data.filter((item) => item.status_barang === filter);

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Manajemen Inventori Barang
      </Typography>

      <Stack direction="row" spacing={2} my={3} flexWrap="wrap">
        {statusList.map((status) => (
          <Chip
            key={status.key}
            label={status.label}
            icon={status.icon}
            color={formatStatus(status.key) === filter ? status.color : "default"}
            variant={filter === status.key ? "filled" : "outlined"}
            onClick={() => setFilter(formatStatus(status.key))}
          />
        ))}
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
                <TableCell>Nomor HP</TableCell>
                <TableCell>Barang</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((item) => {
                const formattedStatus = formatStatus(
                  item.status_barang || "butuh_validasi"
                );
                const config = statusConfig[formattedStatus];

                return (
                  <TableRow key={item.id}>
                    <TableCell>{item.nama_pengirim}</TableCell>
                    <TableCell>{item.nomor_hp_pengirim}</TableCell>
                    <TableCell>
                      <pre style={{ margin: 0, fontSize: 12 }}>
                        {JSON.stringify(item.barang, null, 2)}
                      </pre>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={
                          statusList.find((s) => s.key === item.status_barang)
                            ?.icon
                        }
                        label={
                          statusList.find((s) => s.key === item.status_barang)
                            ?.label || item.status_barang
                        }
                        color={
                          (statusList.find((s) => s.key === item.status_barang)
                            ?.color as
                            | "info"
                            | "success"
                            | "warning"
                            | "default"
                            | "primary"
                            | "secondary"
                            | "error"
                            | undefined) || "default"
                        }
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}
