// src/presentation/layouts/components/SidebarLayout.tsx

import type { ReactNode } from 'react'; 
import Sidebar from './Sidebar'; 

interface SidebarLayoutProps {
  children: ReactNode;
  isCollapsed: boolean;
}

export default function SidebarLayout({ children, isCollapsed }: SidebarLayoutProps) {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar isCollapsed={isCollapsed} />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
