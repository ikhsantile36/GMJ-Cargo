"use client";
import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import { useSearchParams } from "next/navigation";

const RegistrasiUser = () => {
  // hapus nomorHp karena gak dipakai di form ini
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
const nomorHp = searchParams.get("nomorHp");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Kirim password dan confirmPassword ke API
      const response = await fetch(`/api/auth/auth-password?nomorHp=${nomorHp}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ password, confirmPassword }),
});

      const result = await response.json();
      console.log(result);
      if (!response.ok) {
        throw new Error(result.message || "Gagal membuat password");
      }

      window.location.href = "/authentication/login-user";
    } catch (error: any) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Registrasi User"
      description="Buat password baru untuk pengguna ekspedisi"
    >
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        <Grid container spacing={0} justifyContent="center" sx={{ height: "100vh" }}>
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card elevation={9} sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}>
              <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
                <Logo />
              </Box>
              <Typography variant="h5" textAlign="center" mb={3}>
                Registrasi User Expedisi
              </Typography>
              <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <Typography variant="subtitle2" fontWeight={600} component="label" htmlFor="password">
                    Password Baru
                  </Typography>
                  <TextField
                    id="password"
                    type="password"
                    label="Password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Typography variant="subtitle2" fontWeight={600} component="label" htmlFor="confirmPassword">
                    Konfirmasi Password
                  </Typography>
                  <TextField
                    id="confirmPassword"
                    type="password"
                    label="Konfirmasi Password"
                    variant="outlined"
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="warning"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? "Menyimpan..." : "Buat Password"}
                  </Button>
                </Stack>
              </form>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default RegistrasiUser;
