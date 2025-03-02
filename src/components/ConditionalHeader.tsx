"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";

const ConditionalHeader = () => {
  const pathname = usePathname();

  // Si la ruta es "/login" o "/register", no se renderiza el header
  if (pathname === "/login" || pathname === "/register" || pathname === "/home") {
    return null;
  }

  return <Header />;
};

export default ConditionalHeader;