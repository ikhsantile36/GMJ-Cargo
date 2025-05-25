'use client';

import { Typography, Container, Box} from '@mui/material';

export default function HomePage() {
  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box textAlign="center">
        <Typography variant="h3" fontWeight="bold" gutterBottom>
          Halo, Dunia!
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Ini adalah halaman sample sederhana dengan Next.js 13 dan MUI.
        </Typography>
      </Box>
    </Container>
  );
}
