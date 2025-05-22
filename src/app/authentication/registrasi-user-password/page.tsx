"use client";

import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import { useState } from "react";

const RegistrasiUser = () => {
  const [nomorHp, setNomorHp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nomorHp}),
      });

      const result = await response.json();
      console.log(result);
      if (!response.ok) {
        throw new Error(result.message || "Login gagal");
      }

      window.location.href = "/authentication/registrasi-user-password";
    } catch (error: any) {
      alert(error.message); 
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Login User"
      description="Login untuk pengguna ekspedisi"
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
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: "100vh" }}
        >
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
            <Card
              elevation={9}
              sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={3}
              >
                <Logo />
              </Box>
              <Typography variant="h5" textAlign="center" mb={3}>
                Login User Expedisi
              </Typography>
              <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    component="label"
                    htmlFor="phone"
                  >
                    Nomor HP
                  </Typography>
                  <TextField
                    label="08xxxxxxxxxx"
                    variant="outlined"
                    fullWidth
                    value={nomorHp}
                    onChange={(e) => setNomorHp(e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="warning"
                    fullWidth
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
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
