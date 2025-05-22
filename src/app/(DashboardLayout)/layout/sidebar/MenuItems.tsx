import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
  IconMap2,
  IconCash,
  IconPackageImport,
  IconScriptMinus,
  IconArrowAutofitRight,
  IconTruckDelivery,
  IconPackage,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: false,
    subheader: `Sistem Informasi Pengiriman\n&\nPelacakan Barang`,
  },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/",
    allowedRoles: ["SUPERADMIN"],
  },

  {
    id: uniqueId(),
    title: "Input Pengiriman",
    icon: IconPackageImport,
    href: "/input-pengiriman",
    allowedRoles: ["SUPERADMIN"],
  },
  {
    id: uniqueId(),
    title: "Inventory Barang",
    icon: IconTruckDelivery,
    href: "/inventory-barang",
    allowedRoles: ["SUPERADMIN", "USER"],
  },
  // {
  //   id: uniqueId(),
  //   title: "Penerimaan Barang",
  //   icon: IconPackage,
  //   href: "/penerimaan-barang",
  //   allowedRoles: ["USER"],
  // },
  {
    id: uniqueId(),
    title: "Manajemen Wilayah",
    icon: IconMap2,
    href: "/manajemen-wilayah",
    allowedRoles: ["SUPERADMIN"],
  },
  {
    id: uniqueId(),
    title: "Harga Vendor",
    icon: IconCash,
    href: "/harga-vendor",
    allowedRoles: ["SUPERADMIN"],
  },
];

export default Menuitems;
