import { Link, useLocation } from '@tanstack/react-router';

const modules = [
  { path: '/viewer', label: '3D Viewer', registered: true },
  { path: '/2d-views', label: '2D Views', registered: false },
  { path: '/checklists', label: 'Checklists', registered: false },
  { path: '/capture', label: 'Capture', registered: false },
  { path: '/documents', label: 'Documents', registered: false },
  { path: '/users', label: 'Users', registered: false },
  { path: '/reports', label: 'Reports', registered: false },
  { path: '/takt', label: 'Takt Planning', registered: false },
  { path: '/diary', label: 'Project Diary', registered: false },
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
        <p
          style={{
            margin: '0 0 4px',
            padding: '0 8px',
            fontSize: 10,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 1,
            color: '#6b7280',
          }}
        >
          Modules
        </p>
        {modules.map((m) => {
          const isActive = location.pathname === m.path;

          if (m.registered) {
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
          }

          return (
            <span
              key={m.path}
              style={{
                ...navItemStyle,
                color: '#6b7280',
                cursor: 'not-allowed',
              }}
            >
              {m.label}
              <span
                style={{ marginLeft: 'auto', fontSize: 10, color: '#4b5563' }}
              >
                soon
              </span>
            </span>
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

const navItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  borderRadius: 4,
  padding: '6px 8px',
  fontSize: 13,
};
