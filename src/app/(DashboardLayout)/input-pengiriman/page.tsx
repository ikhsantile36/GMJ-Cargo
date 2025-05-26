"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { TarifWilayah } from "@/app/types/tarif-wilayah";

type Props = {
  data: TarifWilayah[];
};

const SamplePage = () => {
  const [formData, setFormData] = useState({
    nomor_resi: "-",
    jenis: "",
    nama_pengirim: "",
    nama_penerima: "",
    nomor_hp_pengirim: "",
    nomor_hp_penerima: "",
    isi_barang: "",
    alamat_pengiriman: "",
    catatan: "",
    wilayah: "",
    biaya: 0,
    jumlah_barang: 0,
    volume_rb: 0,
    total_volume: 0,
    total_biaya_gmj: 0,
    total_biaya_vendor: 0,
    kategori_barang: "-",
    status_barang: "sedang_dikirim",
    metode_penghitungan: "volume",
    barang: [{ panjang: "", lebar: "", tinggi: "" }],
    biaya_satuan: [], // Tambahkan ini
  });

  const [wilayahOptions, setWilayahOptions] = useState<TarifWilayah[]>([]);
  const [jenisOptions, setJenisOptions] = useState<string[]>([]);
  const [tarifVendor, setTarifVendor] = useState<any[]>([]);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { value } = e.target;
    const selectedWilayah = wilayahOptions.find((w) => w.wilayah === value);
    setFormData((prev) => ({
      ...prev,
      wilayah: value,
      volume_rb: selectedWilayah?.volume_rb || 0,
    }));
  };

  const calculateVolume = () => {
    let totalVolume = 0;
    let biaya = 0;
    let biayaPerBarangSatuan = 0;

    interface RangeChecker {
      (value: number, min: number, max: number): boolean;
    }

    const isWithinRange: RangeChecker = (value, min, max) => {
      const epsilon = 0.000001;
      return value + epsilon >= min && value - epsilon <= max;
    };

    // Hitung total volume (p x l x t / 1.000.000) * volume_rb
    formData.barang.forEach((barang) => {
      const panjang = Number(barang.panjang);
      const lebar = Number(barang.lebar);
      const tinggi = Number(barang.tinggi);

      // perhitungan GMJ
      const volume =
        ((panjang * lebar * tinggi) / 1000000) * formData.volume_rb;
      totalVolume += volume;
    });

    // VOlume kubikasi
    if (formData.jenis === "vendor" && tarifVendor.length > 0) {
      const avgRawVolume =
        formData.barang.length > 0
          ? formData.barang.reduce((acc, curr) => {
              const p = Number(curr.panjang);
              const l = Number(curr.lebar);
              const t = Number(curr.tinggi);
              return acc + (p * l * t) / 1000000;
            }, 0) / formData.barang.length
          : 0;

      const tarif = tarifVendor.find((t) => {
        if (t.volume_max == null) {
          return avgRawVolume + 0.000001 >= t.volume_min;
        }
        return isWithinRange(avgRawVolume, t.volume_min, t.volume_max);
      });

      if (tarif) {
        biayaPerBarangSatuan = tarif.biaya_perBarang;
        if (
          formData.barang.length >= 2 &&
          tarif.biaya_diskon &&
          tarif.biaya_diskon > 0
        ) {
          biaya = tarif.biaya_diskon;
        } else {
          biaya = tarif.biaya_perBarang;
        }
      }
    }

    return {
      volume: Math.round(totalVolume * 1000) / 1000,
      biaya,
      biayaPerBarangSatuan,
    };
  };


  const generateNomorResi = () => {
  return `RESI-${Date.now()}`;

};
  const { volume, biaya, biayaPerBarangSatuan } = calculateVolume();

  const getBiayaPerBarang = (barang: {
    panjang: string;
    lebar: string;
    tinggi: string;
  }) => {
    const p = Number(barang.panjang);
    const l = Number(barang.lebar);
    const t = Number(barang.tinggi);
    if (isNaN(p) || isNaN(l) || isNaN(t)) return 0;

    const volumeM3 = (p * l * t) / 1000000;

    // Jika jenis vendor, gunakan tarifVendor
    if (formData.jenis === "vendor" && tarifVendor.length > 0) {
      const tarif = tarifVendor.find((t) => {
        if (t.volume_max == null) return volumeM3 >= t.volume_min;
        return volumeM3 >= t.volume_min && volumeM3 <= t.volume_max;
      });

      if (tarif) {
        if (formData.barang.length >= 2 && tarif.biaya_diskon > 0) {
          return tarif.biaya_diskon;
        }
        return tarif.biaya_perBarang;
      }
    }

    const volume_rb = formData.volume_rb || 0;
    const tarifPerM3 = 1;

    return volumeM3 * volume_rb * tarifPerM3;
  };

  const getVolumePerItem = (barang: {
    panjang: string;
    lebar: string;
    tinggi: string;
  }) => {
    const p = Number(barang.panjang);
    const l = Number(barang.lebar);
    const t = Number(barang.tinggi);
    if (isNaN(p) || isNaN(l) || isNaN(t)) return 0;

    return (p * l * t) / 1000000;
  };



  const getBiayaGMJ = (barang: {
    panjang: string;
    lebar: string;
    tinggi: string;
  }) => {
    const p = Number(barang.panjang);
    const l = Number(barang.lebar);
    const t = Number(barang.tinggi);

    if (isNaN(p) || isNaN(l) || isNaN(t)) return 0;

    const volumeM3 = (p * l * t) / 1000000;

    const selectedWilayah = wilayahOptions.find(
      (w) => w.wilayah === formData.wilayah
    );

    const volume_rb = selectedWilayah?.volume_rb || 0;

    return volumeM3 * volume_rb;
  };

const getTotalBiayaDanVolume = () => {
  let totalVolume = 0;
  let totalBiayaVendor = 0;
  let totalBiayaGMJ = 0;
  const biayaSatuan: number[] = []; // Array untuk menyimpan biaya satuan per barang
  
  const isVendor = formData.jenis === "vendor";

  formData.barang.forEach((barang) => {
    const volumePerItem = getVolumePerItem(barang);
    const biayaPerItemVendor = isVendor ? getBiayaPerBarang(barang) : 0;
    const biayaPerItemGMJ = getBiayaGMJ(barang);

    totalVolume += volumePerItem;
    totalBiayaVendor += biayaPerItemVendor;
    totalBiayaGMJ += biayaPerItemGMJ;
    
    // Hitung biaya satuan per barang (GMJ + Vendor)
    biayaSatuan.push(biayaPerItemGMJ + biayaPerItemVendor);
  });

  const totalSemuaBiaya = totalBiayaVendor + totalBiayaGMJ;

  return {
    totalBiayaVendor: Math.round(totalBiayaVendor * 100) / 100,
    totalBiayaGMJ: Math.round(totalBiayaGMJ * 100) / 100,
    totalSemuaBiaya: Math.round(totalSemuaBiaya * 100) / 100,
    totalVolume: Math.round(totalVolume * 1000) / 1000,
    biayaSatuan, // Tambahkan biayaSatuan ke return value
  };
};


  const { totalBiayaVendor, totalBiayaGMJ, totalSemuaBiaya, totalVolume } =
    getTotalBiayaDanVolume();

  const calculateBerat = () => {
    const { kategori_barang, wilayah } = formData;
    const selectedWilayah = wilayahOptions.find((w) => w.wilayah === wilayah);

    if (!selectedWilayah) return 0;

    let rb = 0;
    if (kategori_barang === "ringan") {
      rb = selectedWilayah.benda_ringan_rb;
    } else if (kategori_barang === "berat") {
      rb = selectedWilayah.benda_berat_rb;
    }

    // Hitung total volume dari semua barang: (p * l * t) / 4000 * rb
    const totalBerat = formData.barang.reduce((acc, curr) => {
      const p = Number(curr.panjang);
      const l = Number(curr.lebar);
      const t = Number(curr.tinggi);
      const berat = ((p * l * t) / 4000) * rb;
      return acc + berat;
    }, 0);

    return isNaN(totalBerat) ? 0 : totalBerat;
  };

  const handleBarangChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedBarang = [...formData.barang];
    if (name === "panjang" || name === "lebar" || name === "tinggi") {
      updatedBarang[index][name as "panjang" | "lebar" | "tinggi"] = value;
    }
    setFormData((prev) => ({ ...prev, barang: updatedBarang }));
  };

  const tambahBarang = () => {
    setFormData((prev) => ({
      ...prev,
      barang: [...prev.barang, { panjang: "", lebar: "", tinggi: "" }],
    }));
  };

  const hapusBarang = (index: number) => {
    const updated = formData.barang.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, barang: updated }));
  };

  const handleMetodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const metode = e.target.value;
    setFormData((prev) => ({
      ...prev,
      metode_penghitungan: metode,
      kategori_barang: metode === "volume" ? "" : prev.kategori_barang,
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  let { 
    totalSemuaBiaya, 
    totalBiayaVendor, 
    totalVolume, 
    biayaSatuan // Ambil biayaSatuan dari getTotalBiayaDanVolume
  } = getTotalBiayaDanVolume();
  
  e.preventDefault();
  const resiBaru = generateNomorResi();

  const { volume } = calculateVolume();
  const total_biaya_gmj = volume;
  const berat = calculateBerat();
  const jumlah_barang = formData.barang.length;

  const selectedWilayah = wilayahOptions.find(
    (w) => w.wilayah === formData.wilayah
  );

  if (!selectedWilayah) {
    alert("Wilayah tidak ditemukan.");
    return;
  }

  if (
    formData.metode_penghitungan === "volume" &&
    totalSemuaBiaya < selectedWilayah.cost_minimum
  ) {
    alert(
      `Harga akhir (${totalSemuaBiaya.toFixed(
        2
      )}) lebih kecil dari cost minimum wilayah (${
        selectedWilayah.cost_minimum
      }).`
    );
    totalSemuaBiaya = selectedWilayah.cost_minimum
    biayaSatuan = Array(formData.barang.length).fill(selectedWilayah.cost_minimum / formData.barang.length);
  }

  if (formData.metode_penghitungan === "berat" && berat < 50) {
    alert(
      `Berat barang hanya ${berat.toFixed(
        2
      )} kg. Minimal pengiriman adalah 50 kg.`
    );
    return;
  }

  try {
    const result = calculateVolume();
    
    const payload = {
      ...formData,
      berat: parseFloat(berat.toFixed(2)),
      total_volume: totalVolume,
      total_biaya_gmj: result.volume,
      total_biaya_vendor: totalBiayaVendor,
      biaya: totalSemuaBiaya,
      jumlah_barang,
      status_barang: "sedang_dikirim",
      nomor_resi: resiBaru,
      biaya_satuan: biayaSatuan, // Tambahkan biaya_satuan ke payload
    };

    const res = await fetch("/api/pengiriman", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Gagal menyimpan data");
    alert("Data berhasil disimpan!");
  } catch (error) {
    alert("Terjadi kesalahan saat menyimpan data.");
    console.error(error);
  }
};

  useEffect(() => {
    const fetchWilayah = async () => {
      const res = await fetch("/api/tarif_wilayah");
      const data = await res.json();
      setWilayahOptions(data);

      const uniqueJenis = Array.from(
        new Set(data.map((item: any) => item.jenis))
      ) as string[];
      setJenisOptions(uniqueJenis);
    };
    fetchWilayah();
  }, []);

  useEffect(() => {
    const fetchTarifVendor = async () => {
      const res = await fetch("/api/tarif-volume");
      const data = await res.json();
      setTarifVendor(data);
    };
    fetchTarifVendor();
  }, []);

  return (
    <PageContainer
      title="Input Pengiriman"
      description="Form input data pengiriman"
    >
      <DashboardCard title="Form Pengiriman">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nama Pengirim"
                name="nama_pengirim"
                value={formData.nama_pengirim}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nomor HP"
                name="nomor_hp_pengirim"
                value={formData.nomor_hp_pengirim}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nama Penerima"
                name="nama_penerima"
                value={formData.nama_penerima}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nomor HP Penerima"
                name="nomor_hp_penerima"
                value={formData.nomor_hp_penerima}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Isi Barang"
                name="isi_barang"
                value={formData.isi_barang}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Alamat Pengiriman"
                name="alamat_pengiriman"
                value={formData.alamat_pengiriman}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Catatan (opsional)"
                name="catatan"
                value={formData.catatan}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="jenis-label">Jenis</InputLabel>
                <Select
                  labelId="jenis-label"
                  name="jenis"
                  value={formData.jenis}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      jenis: e.target.value,
                    }))
                  }
                >
                  {jenisOptions.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="wilayah-label">Wilayah Tujuan</InputLabel>
                <Select
                  labelId="wilayah-label"
                  value={formData.wilayah}
                  onChange={handleSelectChange}
                >
                  {wilayahOptions
                    .filter((item) => item.jenis === formData.jenis) // ⬅️ Filter berdasarkan jenis
                    .map((item) => (
                      <MenuItem key={item.id} value={item.wilayah}>
                        {item.wilayah}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>


            <Grid item xs={12}>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  value={formData.metode_penghitungan}
                  onChange={handleMetodeChange}
                >
                  <FormControlLabel
                    value="volume"
                    control={<Radio color="warning"/>}
                    label="Hitung berdasarkan Volume"
                  />
                  <FormControlLabel
                    value="berat"
                    control={<Radio color="warning"/>}
                    label="Hitung berdasarkan Berat"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {formData.metode_penghitungan === "berat" && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="kategori-barang-label">
                    Kategori Barang
                  </InputLabel>
                  <Select
                    labelId="kategori-barang-label"
                    value={formData.kategori_barang}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        kategori_barang: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="ringan">Benda Ringan</MenuItem>
                    <MenuItem value="berat">Benda Berat</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {formData.barang.map((item, index) => {
              const volumeItem =
                getVolumePerItem(item) * formData.volume_rb || 0;
              const isLastItem = index === formData.barang.length - 1;

              return (
                <Box key={index} mb={2}>
                  <Grid
                    container
                    spacing={2}
                    alignItems="center"
                    sx={{ ml: 2, mt: 2 }}
                  >
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Panjang (cm)"
                        name="panjang"
                        type="number"
                        value={item.panjang}
                        onChange={(e) => handleBarangChange(index, e)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Lebar (cm)"
                        name="lebar"
                        type="number"
                        value={item.lebar}
                        onChange={(e) => handleBarangChange(index, e)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        label="Tinggi (cm)"
                        name="tinggi"
                        type="number"
                        value={item.tinggi}
                        onChange={(e) => handleBarangChange(index, e)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        onClick={() => hapusBarang(index)}
                        disabled={formData.barang.length === 1}
                      >
                        Hapus
                      </Button>
                    </Grid>
                  </Grid>

                  <Box
                    mt={1}
                    color="gray"
                    sx={{ ml: 5, display: "flex", gap: 2 }}
                  >
                    <em>
                      Volume Barang {index + 1}:{" "}
                      {getVolumePerItem(item).toLocaleString("id-ID")} m³
                    </em>
                    <br />
                    <span>
                      Biaya : Rp{" "}
                      {Math.round(volumeItem).toLocaleString("id-ID")}
                    </span>
                   {formData.jenis === "vendor" && (
                      <span>
                        Biaya Vendor: Rp{" "}
                        {Math.round(getBiayaPerBarang(item)).toLocaleString("id-ID")}
                      </span>
                    )}

                  </Box>

                  {/* Tombol tambah hanya muncul setelah barang terakhir */}
                  {isLastItem && (
                    <Box mt={2} sx={{ ml: 2, mt: 2 }}>
                      <Button variant="contained" onClick={tambahBarang} color="warning">
                        + Tambah Barang
                      </Button>
                    </Box>
                  )}
                </Box>
              );
            })}

            <Grid item xs={12}>
              {formData.metode_penghitungan === "volume" ? (
                <Box mt={2}>
                  {/* <strong>Total Volume GMJ :</strong>{" "}
                  {Number(calculateVolume().volume.toFixed(3)).toLocaleString(
                    "id-ID",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 3,
                    }
                  )}{" "}
                  m³ */}
                  {/* <br /> */}
                  <strong>Jumlah Barang:</strong> {formData.barang.length}
                  <br />
                  <strong>Total Volume:</strong> {totalVolume} m³
                  <br />
                  {/* <strong>Biaya Satuan:</strong> Rp{" "}
                  {calculateVolume().biaya.toLocaleString("id-ID")}
                  <br /> */}
                 {formData.jenis === "vendor" && (
                    <Box>
                      <strong>Total Biaya Vendor:</strong> Rp{" "}
                      {Math.round(totalBiayaVendor).toLocaleString("id-ID")} <br />
                    </Box>
                  )}

                  <strong>Total Biaya GMJ:</strong> Rp{" "}
                  {Math.round(totalBiayaGMJ).toLocaleString("id-ID")} <br />
                  <strong>Total Biaya Seluruhnya:</strong> Rp{" "}
                  {Math.round(totalSemuaBiaya).toLocaleString("id-ID")} <br />
                </Box>
              ) : (
                <Box
                  mt={2}
                  p={2}
                  border="1px solid #e0e0e0"
                  borderRadius={2}
                  bgcolor="#f9f9f9"
                >
                  <strong>Kategori Barang:</strong>{" "}
                  {formData.kategori_barang || "-"}
                  <br />
                  <strong>Total Berat: Rp.</strong>{" "}
                  {calculateBerat().toFixed(2)}
                  <br />
                  {calculateBerat() < 50 && (
                    <span style={{ color: "red", fontStyle: "italic" }}>
                      Minimal berat pengiriman adalah 50 kg
                    </span>
                  )}
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button type="submit" variant="contained" color="warning">
                  Simpan Data
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </DashboardCard>
    </PageContainer>
  );
};

export default SamplePage;