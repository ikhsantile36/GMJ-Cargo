'use client';

import { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem
} from '@mui/material';

import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const kotaList = ['MAKASSAR', 'LUWUK', 'GORONTALO', 'KOLAKA', 'UNAHA', 'KENDARI'];

const InputPengiriman = () => {
  const [form, setForm] = useState({
    namaPengirim: '',
    nomorTelepon: '',
    panjang: '',
    lebar: '',
    tinggi: '',
    berat: '',
    alamat: '',
    kota: ''
  });

  const [biaya, setBiaya] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const hitungBiaya = () => {
    const { panjang, lebar, tinggi, berat, kota } = form;

    const volume = (parseFloat(panjang) || 0) * (parseFloat(lebar) || 0) * (parseFloat(tinggi) || 0);
    const beratAsli = parseFloat(berat) || 0;
    const volumeBerat = volume / 6000;
    const beratDikenakan = Math.max(beratAsli, volumeBerat);
    const biayaPerKg = 10000;

    const biayaDimensi = beratDikenakan * biayaPerKg;
    const biayaKota = kotaList.includes(kota.toUpperCase()) ? 0 : 0;

    setBiaya(biayaDimensi + biayaKota);
  };

  return (
    <PageContainer title="Input Pengiriman" description="Form pengiriman barang">
      <DashboardCard title="Input Pengiriman">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nama Pengirim"
              name="namaPengirim"
              value={form.namaPengirim}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nomor Telepon"
              name="nomorTelepon"
              value={form.nomorTelepon}
              onChange={handleChange}
              type="tel"
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Panjang (cm)"
              name="panjang"
              value={form.panjang}
              onChange={handleChange}
              type="number"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Lebar (cm)"
              name="lebar"
              value={form.lebar}
              onChange={handleChange}
              type="number"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Tinggi (cm)"
              name="tinggi"
              value={form.tinggi}
              onChange={handleChange}
              type="number"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Berat (kg)"
              name="berat"
              value={form.berat}
              onChange={handleChange}
              type="number"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Kota Tujuan"
              name="kota"
              value={form.kota}
              onChange={handleChange}
            >
              {kotaList.map((kota) => (
                <MenuItem key={kota} value={kota}>
                  {kota}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Alamat Tujuan"
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={hitungBiaya}>
              Hitung Biaya Kirim
            </Button>
          </Grid>

          {biaya !== null && (
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ padding: 2, backgroundColor: '#f9f9f9' }}>
                <Typography variant="h6">Estimasi Biaya Kirim:</Typography>
                <Typography variant="body1" color="secondary">
                  Rp {biaya.toLocaleString('id-ID')}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </DashboardCard>
    </PageContainer>
  );
};

export default InputPengiriman;
