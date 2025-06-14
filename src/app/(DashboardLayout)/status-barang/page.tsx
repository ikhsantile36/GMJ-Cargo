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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Divider,
  Modal,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Pengiriman } from "@/app/types/pengiriman";
import { useRouter } from "next/navigation";
import { Inventory } from "@/app/types/inventory";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { useSearchParams } from "next/navigation";

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
    color: "warning",
  },
  {
    key: "telah_diterima",
    label: "Telah Diterima",
    icon: <CheckCircleIcon />,
    color: "primary",
  },
  {
    key: "butuh_validasi",
    label: "Butuh Validasi",
    icon: <ErrorIcon />,
    color: "error",
  },
  {
    key: "telah_selesai",
    label: "Telah Selesai",
    icon: <DoneAllIcon />,
    color: "success",
  },
];

export default function InventoryPage() {
  const router = useRouter();
  const [data, setData] = useState<Pengiriman[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<InventoryStatus>("sedang_dikirim");
  const [selectedItem, setSelectedItem] = useState<Pengiriman | null>(null);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [inventoryHistory, setInventoryHistory] = useState<Inventory[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const urlFilter = searchParams.get("filter") as InventoryStatus | null;
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  type Props = {
    data: User[];
  };

  useEffect(() => {
    fetch("/api/pengiriman")
      .then((res) => res.json())
      .then((res) => {
        //console.error(res);
        const arr = Array.isArray(res) ? res : res.data || [];
        const parsedData = arr.map((item: any) => ({
          ...item,
          barang: item.barang,
        }));
        setData(parsedData);
        setLoading(false);
        console.log("datanya adalah", arr);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt.decode(token) as User | null;
        if (decoded) {
          setUserRole(decoded.role.toUpperCase());
          setUserPhone(decoded.nomor_hp); // <-- tambahkan ini
        }
      } catch (err) {
        console.error("Gagal decode token:", err);
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt.decode(token) as User | null;
        if (decoded && decoded.role) {
          setUserRole(decoded.role.toUpperCase());
        }
      } catch (err) {
        console.error("Gagal decode token:", err);
      }
    }
  }, []);

  useEffect(() => {
    const hasAccepted = localStorage.getItem("syaratDiterima");
    if (!hasAccepted) {
      setOpen(true);
    }
  }, []);

  const handleSetuju = () => {
    localStorage.setItem("syaratDiterima", "true");
    setOpen(false);
  };

  const filteredData = data.filter((item) => {
    const matchesRole =
      userRole === "USER"
        ? item.nomor_hp_pengirim === userPhone
        : item.status_barang === filter;

    const matchesSearch =
      item.sttb?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      searchQuery.trim() === "";

    return matchesRole && matchesSearch;
  });

  useEffect(() => {
    const hasAccepted = localStorage.getItem("syaratDiterima");
    if (!hasAccepted) {
      setOpen(true);
    }
  }, []);

  const handleMarkAsSelesai = async (id: string) => {
    try {
      const res = await fetch(`/api/pengiriman/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status_barang: "telah_selesai" }),
      });

      if (!res.ok) throw new Error("Gagal update status.");

      // Refresh data setelah berhasil update
      const updated = await fetch("/api/pengiriman").then((res) => res.json());
      const parsed = updated.map((item: any) => ({
        ...item,
        barang: Array.isArray(item.barang)
          ? item.barang
          : JSON.parse(item.barang),
      }));
      setData(parsed);
    } catch (err) {
      console.error("Gagal update ke telah_selesai:", err);
    }
  };

  const handleOpenDialog = async (item: Pengiriman) => {
    setSelectedItem(item);
    setOpenDialog(true);

    try {
      const res = await fetch(`/api/inventory?nomor_resi=${item.nomor_resi}`);
      const data = await res.json();
      setInventoryHistory(data);
    } catch (error) {
      console.error("Gagal memuat history:", error);
      setInventoryHistory([]);
    }
  };

  const handleCloseDialog = () => {
    setSelectedItem(null);
    setOpenDialog(false);
  };

  useEffect(() => {
    if (urlFilter) setFilter(urlFilter);
  }, [urlFilter]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Manajemen Status Barang
      </Typography>

      {userRole !== "USER" && (
        <Stack
          direction="row"
          spacing={2}
          my={3}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2} flexWrap="wrap">
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
        </Stack>
      )}
      {userRole !== "USER" && (
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Typography variant="body1">Cari STT:</Typography>
          <input
            type="text"
            placeholder="Masukkan STT"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "250px",
            }}
          />
        </Stack>
      )}

      {loading ? (
        <Box mt={4} display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {userRole === "USER" && (
            <Stack direction="row" justifyContent="flex-end" mb={2}>
              <Button
                variant="outlined"
                color="warning"
                onClick={() => setOpen(true)}
                startIcon={<VisibilityIcon />}
              >
                Lihat Syarat & Ketentuan
              </Button>
            </Stack>
          )}
          <Paper elevation={2} sx={{ mt: userRole === "USER" ? 4 : 0 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nama Pengirim</TableCell>
                  <TableCell align="center">Nomor Resi</TableCell>
                  <TableCell align="center">Alamat Pengiriman</TableCell>
                  {userRole === "USER" ? (
                    <TableCell align="center">Status</TableCell>
                  ) : (
                    <TableCell align="center">STT</TableCell>
                  )}
                  <TableCell align="center">View Detail</TableCell>
                  <TableCell align="center">Update</TableCell>
                  {userRole !== "USER" && (
                    <TableCell align="center">Edit</TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
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
                        <TableCell align="center">{item.nomor_resi}</TableCell>
                        <TableCell
                          align="center"
                          sx={{
                            maxWidth: 200,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.alamat_pengiriman}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={
                              userRole === "USER"
                                ? statusItem?.label || item.status_barang
                                : item.sttb || "STT"
                            }
                            icon={
                              userRole === "USER" ? statusItem?.icon : undefined
                            }
                            color={
                              userRole === "USER"
                                ? (statusItem?.color as MuiColor) || "default"
                                : "default"
                            }
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>

                        <TableCell align="center">
                          <Button
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleOpenDialog(item)}
                          >
                            View
                          </Button>
                        </TableCell>
                        <TableCell align="center">
                          {(() => {
                            if (
                              item.status_barang === "telah_diterima" &&
                              (userRole === "ADMIN" || userRole === "USER")
                            ) {
                              return (
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  onClick={() =>
                                    router.push(`/penerimaan-barang/${item.id}`)
                                  }
                                >
                                  Update
                                </Button>
                              );
                            }

                            if (item.status_barang === "sedang_dikirim") {
                              if (userRole !== "USER") {
                                return (
                                  <Button
                                    variant="outlined"
                                    color="warning"
                                    onClick={() =>
                                      router.push(
                                        `/status-barang/update/${item.id}`
                                      )
                                    }
                                  >
                                    Update
                                  </Button>
                                );
                              }
                            }

                            if (
                              item.status_barang === "butuh_validasi" &&
                              userRole === "ADMIN"
                            ) {
                              return (
                                <Button
                                  variant="outlined"
                                  color="success"
                                  onClick={() =>
                                    router.push(`/validasi/${item.id}`)
                                  }
                                >
                                  Update
                                </Button>
                              );
                            }

                            if (
                              item.status_barang === "telah_selesai" &&
                              (userRole === "ADMIN" || userRole === "USER")
                            ) {
                              return (
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  onClick={() =>
                                    router.push(`/validasi/${item.id}`)
                                  }
                                >
                                  BUKTI
                                </Button>
                              );
                            }

                            return "-";
                          })()}
                        </TableCell>

                        {userRole !== "USER" && (
                          <TableCell align="center">
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() =>
                                router.push(`/pengiriman/edit/${item.id}`)
                              }
                            >
                              Edit
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}

      {userRole === "USER" && (
        <Modal open={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: 800,
              maxHeight: "90vh",
              overflowY: "auto",
              bgcolor: "#fff",
              boxShadow: 10,
              borderRadius: 3,
              p: 4,
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
              color={"warning.main"}
              sx={{ mb: 2 }}
              align="center"
            >
              PEMBERITAHUAN TENTANG BATAS TANGGUNG JAWAB PENGANGKUT
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, textAlign: "justify" }}>
              Jika pengangkutan Udara dan Laut, maka tunduk kepada undang-undang
              yang berlaku mengatur,barang pada waktu penyerahan dari pengirim
              kepada pengangkut dan dengan tarif pembayaran yang di isyaratkan
              oleh pengangkut membatasi tanggung jawab pengangkut atas ganti
              rugi karena kehilangan, kerusakan dan keterlambatan yang di
              sebabkan kesalahan pengangkutan dengan besaran nilai ganti
              kerugian tertentu. Kecuali jika ada pernyataan khusus tentang
              harga barang pada waktu penyerahan dari pengirim kepada pengangkut
              dari pengirim kepada pengangkut dengan tarif yang berlaku.
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="h6"
              fontWeight={700}
              gutterBottom
              color={"warning.main"}
              align="center"
            >
              SYARAT DAN KETENTUAN PENGANGKUTAN / KIRIMAN BARANG
            </Typography>

            <Box component="ol" sx={{ pl: 3, pr: 1, mb: 2 }}>
              {[
                "Pengirim wajib mengikuti  segala syarat dan ketentuan kiriman yang di keluarkan pihak GMJ / Pengangkut dan wajib meminta surat tanda terima saat menyerahkan barang kiriman kepada.",
                "Isi barang kiriman tidak DIPERIKSA pihak GMJ/pengangkut, dan sepenuhnya menjadi tanggung jawab pengirim.",
                "Barang yang dikirim harus dibungkus/packaging secara Sempurna. Pengepakan yang kurang sempurna dapat menimbulkan kerugian yang menjadi tanggung jawab dari pihak pengirim sepenuhnya. Pengirim di sarankan mengasuransikan barang  yang mudah rusak yang mempunyai nilai tinggi. ",
                "GMJ/Pengangkut tidak bertanggung jawab atas kiriman barang yang dianggap ilegal. Pengirim tidak berkeberatan jika barang kiriman dicurigai sehingga pihak berwenang memeriksa dan menahan kiriman jika barang tersebut ilegal. Jika terjadi sesuatu dan lain hal barang tersebut di tahan oleh pihak berwajib,maka pemilik barang tersebut yang bertanggung jawab  dan menyelesaikan",
                "Claim paling lambat 1 x 24 jam setelah barang telah diterima oleh penerima. Claim  Ganti rugi diakibatkan barang hilang setinggi-tingginya 10 (sepuluh) kali dari biaya kiriman yang tertera pada biaya pengiriman (Invoice), dan berlakunya ganti rugi apabila pengirim telah dibayar lunas  dan melampirkan tanda bukti kiriman yang sah dan bukti-bukti lainnya.",
                "GMJ/Pengangkut tidak memberikan ganti rugi apapun atas akibat keterlambatan, kerusakan atau kehilangan barang yang disebabkan oleh kondisi lalu lintas pengangkutan atau di karenakan terjadi faktor cuaca buruk, Bencana alam, huru- hara, penjarahan, kecelakaan penerbangan, kecelakaan laut dan peperangan (force majeure). saat proses pengiriman	",
                "GMJ/Pengangkut tidak menerima kiriman: surat warkat,surat berharga, wesel.cek,emas,perak,permata,logam mulia,uang meskipun di asuransikan.",
                " Dilarang mengirim barang yang mudah meledak, mudah menyala atau terbakar, barang yang dapat membahayakan keselamatan umum.Dan barang yang dilarang pemerintah dan melanggar hukum.",
                " GMJ/Pengangkut hanya bertanggung jawab atas penyampaian barang kiriman ke alamat barang yang di tuju (penerima)/sesuai alamat, jika terjadi sesuatu dan lain hal barang tersebut di tahan oleh pihak berwajib,maka pemilik barang tersebut yang bertanggung jawab dan menyelesaikan permasalahan tersebut.  ",
              ].map((text, idx) => (
                <Typography
                  key={idx}
                  component="li"
                  variant="body2"
                  sx={{ mb: 1, textAlign: "justify" }}
                >
                  {text}
                </Typography>
              ))}
            </Box>

            <Box textAlign="right" mt={4}>
              <Button
                variant="contained"
                color="warning"
                size="large"
                onClick={handleSetuju}
                sx={{ borderRadius: 2, px: 4 }}
              >
                Saya Mengerti & Setuju
              </Button>
            </Box>
          </Box>
        </Modal>
      )}

      {/* MODAL DETAIL */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Detail Inventori</DialogTitle>
        <DialogContent dividers>
          {selectedItem && (
            <>
              <Grid container spacing={2}>
                {/* Kolom Kiri */}
                <Grid item xs={12} sm={6}>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography>
                      <strong>Nama Pengirim:</strong>{" "}
                      {selectedItem.nama_pengirim}
                    </Typography>
                    <Typography>
                      <strong>Nomor HP:</strong>{" "}
                      {selectedItem.nomor_hp_pengirim}
                    </Typography>
                    <Typography>
                      <strong>Nomor Resi:</strong>{" "}
                      {selectedItem.nomor_resi || "-"}
                    </Typography>
                    <Typography>
                      <strong>Status:</strong> {selectedItem.status_barang}
                    </Typography>
                  </Box>
                </Grid>

                {/* Kolom Kanan */}
                <Grid item xs={12} sm={6}>
                  <Box display="flex" flexDirection="column" gap={1}>
                    <Typography>
                      <strong>Nama Penerima:</strong>{" "}
                      {selectedItem.nama_penerima}
                    </Typography>
                    <Typography>
                      <strong>Nomor HP:</strong>{" "}
                      {selectedItem.nomor_hp_penerima}
                    </Typography>
                    <Typography>
                      <strong>Jumlah Barang:</strong>{" "}
                      {selectedItem.jumlah_barang}
                    </Typography>
                    <Typography>
                      <strong>Jenis:</strong> {selectedItem.jenis}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    gap={1}
                    sx={{ wordBreak: "break-word" }}
                  >
                    <Typography>
                      <strong>Wilayah:</strong> {selectedItem.wilayah}
                    </Typography>
                    <Typography>
                      <strong>Alamat:</strong> {selectedItem.alamat_pengiriman}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box mt={2}>
                <Typography variant="h6" gutterBottom>
                  Riwayat Lokasi Barang
                </Typography>

                {inventoryHistory.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Tidak ada histori lokasi.
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      maxHeight: 300,
                      overflowY: "auto",
                      border: "1px solid #ccc",
                      borderRadius: 2,
                      p: 2,
                      mt: 1,
                    }}
                  >
                    {inventoryHistory.map((log, index) => (
                      <Box
                        key={index}
                        sx={{
                          mb: 2,
                          p: 1.5,
                          borderBottom: "1px solid #eee",
                          backgroundColor: "#FF9800",
                          borderRadius: 1,
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 2,
                        }}
                      >
                        <Box sx={{ flex: "1 1 60%", minWidth: 0 }}>
                          <Typography
                            fontWeight="bold"
                            variant="subtitle2"
                            noWrap
                          >
                            {new Date(log.waktu_update).toLocaleDateString(
                              "id-ID"
                            )}
                          </Typography>
                          <Typography variant="body2" noWrap>
                            Lokasi:{" "}
                            <strong>
                              {index === 0
                                ? "Jl. Kebon Kacang V No.29, RT.6/RW.6, Kb. Kacang, Kota Jakarta Pusat, DKI"
                                : log.lokasi}
                            </strong>
                          </Typography>
                          {log.keterangan && (
                            <Typography
                              variant="body2"
                              color="text.default"
                              noWrap
                            >
                              Catatan: {log.keterangan}
                            </Typography>
                          )}
                          {log.waktu_update && (
                            <Typography
                              variant="body2"
                              color="text.default"
                              noWrap
                            >
                              Waktu Update:{" "}
                              {new Date(log.waktu_update).toLocaleString(
                                "id-ID",
                                {
                                  timeZone: "Asia/Jakarta",
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                }
                              )}
                            </Typography>
                          )}
                        </Box>

                        {log.foto && (
                          <Box
                            sx={{
                              width: { xs: 60, sm: 70 },
                              height: { xs: 60, sm: 70 },
                              flexShrink: 0,
                            }}
                          >
                            <a
                              href={log.foto}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {/* <img
                                src={log.foto}
                                alt="Foto lokasi"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  borderRadius: 4,
                                  border: "1px solid #ccc",
                                  cursor: "pointer",
                                }}
                              /> */}
                              <Image
                                src={log.foto}
                                alt="Foto Lokasi"
                                width={100}
                                height={100}
                              />
                            </a>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} color="warning">
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
