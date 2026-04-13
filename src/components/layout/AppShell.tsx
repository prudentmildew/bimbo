import type * as React from 'react';
import type { ReactNode } from 'react';
import { useAppStore } from '../../store';
import { LeftSidebar } from './LeftSidebar';
import { RightPanel } from './RightPanel';

export function AppShell({ children }: { children: ReactNode }) {
  const leftSidebarOpen = useAppStore((s) => s.leftSidebarOpen);
  const rightPanelOpen = useAppStore((s) => s.rightPanelOpen);
  const toggleLeftSidebar = useAppStore((s) => s.toggleLeftSidebar);
  const toggleRightPanel = useAppStore((s) => s.toggleRightPanel);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: '#111827',
        color: '#f3f4f6',
      }}
    >
      {leftSidebarOpen && <LeftSidebar />}

      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 10,
            display: 'flex',
            gap: 4,
          }}
        >
          <button type="button" onClick={toggleLeftSidebar} style={buttonStyle}>
            {leftSidebarOpen ? '\u25C0' : '\u25B6'} Sidebar
          </button>
          <button type="button" onClick={toggleRightPanel} style={buttonStyle}>
            Panel {rightPanelOpen ? '\u25B6' : '\u25C0'}
          </button>
        </div>
        <div style={{ flex: 1 }}>{children}</div>
      </div>

      {rightPanelOpen && <RightPanel />}
    </div>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: '4px 8px',
  fontSize: 12,
  background: 'rgba(31, 41, 55, 0.8)',
  color: '#d1d5db',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
};
