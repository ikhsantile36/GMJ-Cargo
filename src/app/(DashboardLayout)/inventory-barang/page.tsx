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
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useEffect, useState } from "react";
import { InventoryItem } from "@/app/types/inventory";
import VisibilityIcon from "@mui/icons-material/Visibility";

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
    color: "info",
  },
  {

    key: "telah_diterima",
    label: "Telah Diterima",
    icon: <CheckCircleIcon />,
    color: "success",
  },
  {
    key: "butuh_validasi",
    label: "Butuh Validasi",
    icon: <ErrorIcon />,
    color: "warning",
  },
  {
    key: "telah_selesai",
    label: "Telah Selesai",
    icon: <DoneAllIcon />,
    color: "default",
  },
];

export default function InventoryPage() {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<InventoryStatus>("sedang_dikirim");

  useEffect(() => {
    fetch("/api/pengiriman")
      .then((res) => res.json())
      .then((res) => {
        console.log("Data dari API:", res); 
        setData(res);
        const parsedData = res.map((item: any) => ({
          ...item,
          barang: Array.isArray(item.barang)
            ? item.barang
            : JSON.parse(item.barang),
        }));
        console.log("Data parsed:", parsedData);
        setData(parsedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // const filteredData = data.filter((item) => item.status_barang === filter);
  const filteredData = data.filter((item) => {
    console.log("Status item:", item.status_barang);
    return item.status_barang === filter;
  });

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
            color={status.key === filter ? status.color : "default"}
            variant={status.key === filter ? "filled" : "outlined"}
            onClick={() => setFilter(status.key)}
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
                <TableCell align="center">Nama Pengirim</TableCell>
                <TableCell align="center">Nomor HP</TableCell>
                <TableCell align="center">Jumlah Barang</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">View</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
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
                      <TableCell align="center">{item.nama_pengirim}</TableCell>
                      <TableCell align="center">
                        {item.nomor_hp_pengirim}
                      </TableCell>
                      <TableCell align="center">{item.jumlah_barang}</TableCell>

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
                      <Button startIcon={<VisibilityIcon />}>View</Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
}