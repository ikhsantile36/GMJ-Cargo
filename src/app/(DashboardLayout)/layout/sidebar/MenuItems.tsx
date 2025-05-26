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
  IconChecklist 
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
    allowedRoles: ["OWNER", "ADMIN"],
  },

  {
    id: uniqueId(),
    title: "Input Pengiriman",
    icon: IconPackageImport,
    href: "/input-pengiriman",
    allowedRoles: ["ADMIN", "OPERATOR"],
  },
  {
    id: uniqueId(),
    title: "Inventory Barang",
    icon: IconTruckDelivery,
    href: "/inventory-barang",
    allowedRoles: ["OWNER", "ADMIN"],
  },
   {
    id: uniqueId(),
    title: "Status Barang",
    icon: IconChecklist,
    href: "/status-barang",
    allowedRoles: ["ADMIN" , "USER", "OPERATOR"],
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
    allowedRoles: ["ADMIN"],
  },
  {
    id: uniqueId(),
    title: "Harga Vendor",
    icon: IconCash,
    href: "/harga-vendor",
    allowedRoles: ["ADMIN"],
  },
  {
    id: uniqueId(),
    title: "Manajemen User",
    icon: IconMap2,
    href: "/manajemen-user",
    allowedRoles: ["OWNER"],
  },
];

export default Menuitems;
