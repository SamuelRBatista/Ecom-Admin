import { Outlet } from 'react-router-dom';

import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Sidebar isCollapsed={false} />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
