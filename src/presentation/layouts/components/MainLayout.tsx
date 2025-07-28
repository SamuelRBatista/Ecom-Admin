import React from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '../../components/common/Sidebar';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Sidebar /> {/* Adicione a navegação aqui */}
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
