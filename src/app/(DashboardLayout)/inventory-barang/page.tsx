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
    key: "sedang dikirim",
    label: "Sedang Dikirim",
    icon: <LocalShippingIcon />,
    color: "info",
  },
  {
    key: "telah diterima",
    label: "Telah Diterima",
    icon: <CheckCircleIcon />,
    color: "success",
  },
  {
    key: "butuh validasi",
    label: "Butuh Validasi",
    icon: <ErrorIcon />,
    color: "warning",
  },
  {
    key: "telah selesai",
    label: "Telah Selesai",
    icon: <DoneAllIcon />,
    color: "default",
  },
];

export default function InventoryPage() {
  const [data, setData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<InventoryStatus>("sedang dikirim");

  useEffect(() => {
    fetch("/api/pengiriman")
      .then((res) => res.json())
      .then((res) => {
        console.log("Data dari API:", res); 
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // const filteredData = data.filter((item) => item.status_barang === filter);
  const filteredData = data; 

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
                <TableCell>Nama Pengirim</TableCell>
                <TableCell>Nomor HP</TableCell>
                <TableCell>Barang</TableCell>
                <TableCell>Status</TableCell>
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
                      <TableCell>{item.nama_pengirim}</TableCell>
                      <TableCell>{item.nomor_hp_pengirim}</TableCell>
                      <TableCell>
                        <Typography fontSize={13}>
                          Panjang: {item.barang.panjang} cm<br />
                          Lebar: {item.barang.lebar} cm<br />
                          Tinggi: {item.barang.tinggi} cm
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={statusItem?.icon}
                          label={statusItem?.label || item.status_barang}
                          color={(statusItem?.color as MuiColor) || "default"}
                          variant="outlined"
                          size="small"
                        />
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