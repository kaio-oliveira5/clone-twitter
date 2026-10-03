import type { ReactNode } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

function Layout({ children, onLogout }: LayoutProps) {
  return (
    <div>
      <Navbar onLogout={onLogout} />

      <main>{children}</main>
    </div>
  );
}

export default Layout;
