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
  IconChecklist,
<<<<<<< HEAD
  IconReceipt ,
  IconEdit 
=======
  IconEdit,
  IconReceipt 
>>>>>>> d36e0cf4c106bd80711eaf7d207d3d1ba0c6f1bd
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
    href: "/dashboard",
    allowedRoles: ["OWNER", "ADMIN"],
  },

  {
    id: uniqueId(),
    title: "Input Pengiriman",
    icon: IconPackageImport,
    href: "/input-pengiriman",
    allowedRoles: ["ADMIN", "OPERATOR", "OWNER"],
  },
  {
    id: uniqueId(),
    title: "Rekap Pengiriman",
    icon: IconTruckDelivery,
    href: "/inventory-barang",
    allowedRoles: ["OWNER", "ADMIN"],
  },
  {
    id: uniqueId(),
    title: "Status Barang",
    icon: IconChecklist,
    href: "/status-barang",
    allowedRoles: ["ADMIN", "USER", "OPERATOR", "OWNER"],
  },
  {
    id: uniqueId(),
    title: "Manual Input",
<<<<<<< HEAD
    icon: IconEdit ,
    href: "/manual-input",
    allowedRoles: ["OPERATOR"],
=======
    icon: IconEdit,
    href: "/manual-input",
    allowedRoles: ["OWNER", "ADMIN", "OPERATOR"],
>>>>>>> d36e0cf4c106bd80711eaf7d207d3d1ba0c6f1bd
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
  {
    id: uniqueId(),
    title: "Invoice",
    icon: IconReceipt,
    href: "/invoice",
    allowedRoles: ["ADMIN", "OPERATOR", "OWNER"],
  },
];

export default Menuitems;
