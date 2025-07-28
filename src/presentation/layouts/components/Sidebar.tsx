import Nav from '../common/Nav'

interface SidebarProps {
  isCollapsed: boolean;
}

export default function Sidebar( { isCollapsed }: SidebarProps ) {
    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <Nav />
        </div>
    );
}
