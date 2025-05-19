import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
  IconMap2 ,
  IconCash ,
  IconPackageImport ,
  IconScriptMinus,
  IconArrowAutofitRight,
  IconTruckDelivery 
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Sistem Informasi Pengiriman & Pelacakan Barang",
  },

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/",
  },
  // {
  //   navlabel: true,
  //   subheader: "Utilities",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Typography",
  //   icon: IconTypography,
  //   href: "/utilities/typography",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Shadow",
  //   icon: IconCopy,
  //   href: "/utilities/shadow",
  // },
  // {
  //   navlabel: true,
  //   subheader: "Auth",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Login",
  //   icon: IconLogin,
  //   href: "/authentication/login",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Register",
  //   icon: IconUserPlus,
  //   href: "/authentication/register",
  // },
  // {
  //   navlabel: true,
  //   subheader: "Extra",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Icons",
  //   icon: IconMoodHappy,
  //   href: "/icons",
  // },

  {
    id: uniqueId(),
    title: "Input Pengiriman",
    icon: IconPackageImport ,
    href: "/input-pengiriman",
  },
  {
    id: uniqueId(),
    title: "Inventory Barang",
    icon: IconTruckDelivery,
    href: "/inventory-barang",
  },
  {
    id: uniqueId(),
    title: "Manajemen Wilayah",
    icon: IconMap2 ,
    href: "/manajemen-wilayah",
  },
  {
    id: uniqueId(),
    title: "Harga Vendor",
    icon: IconCash ,
    href: "/harga-vendor",
  },
];

export default Menuitems;
