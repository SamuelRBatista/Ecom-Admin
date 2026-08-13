// src/presentation/layouts/components/SidebarLayout.tsx

import type { ReactNode } from 'react'; 
import Sidebar from './Sidebar'; 

interface SidebarLayoutProps {
  children: ReactNode;
  isCollapsed: boolean;
}

export default function SidebarLayout({ children, isCollapsed }: SidebarLayoutProps) {
  return (
    <div className="layout">
      <Sidebar isCollapsed={isCollapsed} />
      <main className="content">{children}</main>
    </div>
  );
}
