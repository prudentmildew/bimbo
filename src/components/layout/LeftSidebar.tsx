import { Link, useLocation } from '@tanstack/react-router';
import type * as React from 'react';
import { ClipControls } from '../sidebar/ClipControls';
import { LayerPanel } from '../sidebar/LayerPanel';
import { NavigationModeToggle } from '../sidebar/NavigationModeToggle';

const modules = [
  { path: '/viewer', label: '3D Viewer' },
  { path: '/2d-views', label: '2D Views' },
  { path: '/checklists', label: 'Checklists' },
  { path: '/capture', label: 'Capture' },
  { path: '/documents', label: 'Documents' },
  { path: '/users', label: 'Users' },
  { path: '/reports', label: 'Reports' },
  { path: '/takt', label: 'Takt Planning' },
  { path: '/diary', label: 'Project Diary' },
] as const;

export function LeftSidebar() {
  const location = useLocation();

  return (
    <aside style={sidebarStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#fff' }}>
          bimbo
        </h1>
        <p style={{ margin: 0, fontSize: 11, color: '#9ca3af' }}>
          BIM Prototype
        </p>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
        <LayerPanel />
        <div style={dividerStyle} />
        <ClipControls />
        <div style={dividerStyle} />
        <NavigationModeToggle />
        <div style={dividerStyle} />
        <p style={sectionLabelStyle}>Modules</p>
        {modules.map((m) => {
          const isActive = location.pathname === m.path;
          return (
            <Link
              key={m.path}
              to={m.path}
              style={{
                ...navItemStyle,
                background: isActive ? '#374151' : 'transparent',
                color: isActive ? '#fff' : '#d1d5db',
                textDecoration: 'none',
              }}
            >
              {m.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

const sidebarStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  width: 220,
  borderRight: '1px solid #374151',
  background: '#1f2937',
  flexShrink: 0,
};

const headerStyle: React.CSSProperties = {
  padding: 12,
  borderBottom: '1px solid #374151',
};

const dividerStyle: React.CSSProperties = {
  borderBottom: '1px solid #374151',
  margin: '8px 0',
};

const sectionLabelStyle: React.CSSProperties = {
  margin: '0 0 4px',
  padding: '0 8px',
  fontSize: 10,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 1,
  color: '#6b7280',
};

const navItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  borderRadius: 4,
  padding: '6px 8px',
  fontSize: 13,
};
