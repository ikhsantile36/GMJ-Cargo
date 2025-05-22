"use client";
import React, { useEffect, useState } from "react";
import Menuitems from "./MenuItems";
import { usePathname } from "next/navigation";
import { Box, List } from "@mui/material";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup/NavGroup";
import jwt from "jsonwebtoken";
import { User } from "@/app/types/user";

const SidebarItems = ({ toggleMobileSidebar }: any) => {
  const pathname = usePathname();
  const pathDirect = pathname;
  const [userRole, setUserRole] = useState<string | null>(null);

  type Props = {
    data: User[];
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode token tanpa verifikasi, hanya baca payload
        const decoded = jwt.decode(token) as User | null;
        if (decoded && decoded.role) {
          setUserRole(decoded.role.toUpperCase()); // pastikan UPPERCASE untuk match dengan allowedRoles
        } else {
          console.warn("Token tidak mengandung role");
        }
      } catch (err) {
        console.error("Gagal decode token:", err);
      }
    } else {
      console.warn("Tidak ada token di localStorage");
    }
  }, []);

  // Jika role belum dimuat, bisa return null / loader / skeleton
  if (!userRole) return null;

  // Filter menu sesuai role
  const filteredMenu = Menuitems.filter((item) => {
  if (!item.allowedRoles) return true; // item umum tanpa pembatasan role
  return item.allowedRoles.includes(userRole);
});
  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 4 }} className="sidebarNav" component="div">
        {filteredMenu.map((item) => {
          // {/********SubHeader**********/}
          if (item.subheader) {
            return null;

            // {/********If Sub Menu**********/}
            /* eslint no-else-return: "off" */
          } else {
            return (
              <NavItem
                item={item}
                key={item.id}
                pathDirect={pathDirect}
                onClick={toggleMobileSidebar}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;
