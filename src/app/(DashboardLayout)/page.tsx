"use client";
import { Grid, Box, Typography } from "@mui/material";
import { useEffect } from "react";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
// components
import SalesOverview from "@/app/(DashboardLayout)/components/dashboard/SalesOverview";
import YearlyBreakup from "@/app/(DashboardLayout)/components/dashboard/YearlyBreakup";
import RecentTransactions from "@/app/(DashboardLayout)/components/dashboard/RecentTransactions";
import ProductPerformance from "@/app/(DashboardLayout)/components/dashboard/ProductPerformance";
import Blog from "@/app/(DashboardLayout)/components/dashboard/Blog";
import MonthlyEarnings from "@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings";
// import jwt_decode from "jwt-decode";
import type { User } from "@/app/types/user";
import jwt from "jsonwebtoken";


const Dashboard = () => {

  type Props = {
    data: User[];
  };

 useEffect(() => {
    const token = localStorage.getItem("token");
     console.log("Token dari localStorage:", token);

    if (token) {
      try {
        // Decode token tanpa verifikasi secret (hanya decode payload)
        const decoded = jwt.decode(token) as User | null;
        if (decoded) {
          console.log("Role user:", decoded.role);
        } else {
          console.log("Token kosong setelah decode");
        }
      } catch (err) {
        console.error("Token tidak valid:", err);
      }
    } else {
      console.log("Belum login");
    }
  }, []);
  
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup />
              </Grid>
              <Grid item xs={12}>
                <MonthlyEarnings />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
            <RecentTransactions />
          </Grid>
          <Grid item xs={12} lg={8}>
            <ProductPerformance />
          </Grid>
          <Grid item xs={12}>
            <Blog />
          </Grid>
        </Grid>
      </Box>
      {/* <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard Ekspedisi
        </Typography>
        <Typography variant="body1">
          Selamat datang di dashboard ekspedisi. Silakan pilih menu
          untuk mulai mengelola data pengiriman.
        </Typography>
      </Box> */}
    </PageContainer>
  );
};

export default Dashboard;
