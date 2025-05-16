'use client';

import {
  Box,
  Typography,
  Chip,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { InventoryItem } from '@/app/types/inventory';

type InventoryStatus =
  | 'sedang dikirim'
  | 'telah diterima'
  | 'butuh validasi'
  | 'telah selesai';  

type Props = {
  data: InventoryItem[];
};

const inventoryData: InventoryItem[] = [
  { id: 1, namaBarang: 'Status Dummy', status: 'sedang dikirim' },
  { id: 2, namaBarang: 'Status Dummy', status: 'telah diterima' },
  { id: 3, namaBarang: 'Status Dummy', status: 'butuh validasi' },
  { id: 4, namaBarang: 'Status Dummy', status: 'telah selesai' },
];

const statusConfig: Record<
  InventoryStatus,
  { color: 'info' | 'success' | 'warning' | 'default'; icon: React.ReactElement }
> = {
  'sedang dikirim': { color: 'info', icon: <LocalShippingIcon /> },
  'telah diterima': { color: 'success', icon: <CheckCircleIcon /> },
  'butuh validasi': { color: 'warning', icon: <ErrorIcon /> },
  'telah selesai': { color: 'default', icon: <DoneAllIcon /> },
};

export default function InventoryPage() {
  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Manajemen Inventori Barang
      </Typography>

      <Stack spacing={2} sx={{ mt: 4 }}>
        {inventoryData.map((item) => {
          const config = statusConfig[item.status];
          return (
            <Card key={item.id} variant="outlined">
              <CardContent
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography>{item.namaBarang}</Typography>
                <Chip
                  icon={config.icon}
                  label={item.status}
                  color={config.color}
                  variant="outlined"
                />
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}
