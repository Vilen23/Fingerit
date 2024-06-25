import { Navbar2 } from "@/components/Navbar2";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar2 />
      {children}
    </div>
  );
}
