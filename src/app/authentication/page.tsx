"use client";

import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  Card,
  CardContent,
} from "@mui/material";
import { useRouter } from "next/navigation";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export default function AuthenticationPage() {
  const router = useRouter();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5", // opsional untuk latar belakang yang lebih halus
        px: 2, // padding horizontal di mobile
      }}
    >
      <Card elevation={6} sx={{ width: "100%", maxWidth: 400 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Selamat Datang
          </Typography>
          <Typography variant="body1" align="center" mb={4}>
            Pilih tipe login Anda
          </Typography>

          <Stack spacing={3}>
            <Button
              variant="outlined"
              size="large"
              color="warning"
              startIcon={<PersonOutlineIcon />}
              onClick={() => router.push("/authentication/login-user")}
              fullWidth
            >
              Login sebagai User
            </Button>

            <Button
              variant="contained"
              size="large"
              color="warning"
              startIcon={<AdminPanelSettingsIcon />}
              onClick={() => router.push("/authentication/login")}
              fullWidth
            >
              Login sebagai Admin / Pengelola
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
