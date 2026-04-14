import { Link, useLocation } from '@tanstack/react-router';
import { ClipControls } from '../sidebar/ClipControls';
import { LayerPanel } from '../sidebar/LayerPanel';
import { NavigationModeToggle } from '../sidebar/NavigationModeToggle';
import { UserMenu } from '../sidebar/UserMenu';

const modules = [
  { path: '/viewer', label: '3D Viewer', shell: false },
  { path: '/2d-views', label: '2D Views', shell: true },
  { path: '/checklists', label: 'Checklists', shell: true },
  { path: '/capture', label: 'Capture', shell: true },
  { path: '/documents', label: 'Documents', shell: true },
  { path: '/users', label: 'Users', shell: false },
  { path: '/reports', label: 'Reports', shell: true },
  { path: '/takt', label: 'Takt Planning', shell: true },
  { path: '/diary', label: 'Project Diary', shell: true },
] as const;

export function LeftSidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar-left">
      <div className="sidebar-header">
        <h1 className="sidebar-logo">bimbo</h1>
        <p className="mono-label">v0.0.0-dev</p>
      </div>

      <div className="sidebar-body">
        <div className="sidebar-section">
          <LayerPanel />
          <hr />
          <ClipControls />
          <hr />
          <NavigationModeToggle />
          <hr />
          <p className="mono-label sidebar-section-label">Modules</p>
          {modules.map((m) => {
            const isActive = location.pathname === m.path;
            return (
              <Link
                key={m.path}
                to={m.path}
                className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
              >
                {m.label}
                {m.shell && <span className="sidebar-badge">soon</span>}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="sidebar-footer">
        <UserMenu />
      </div>
    </aside>
  );
}
