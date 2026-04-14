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
    <div className="app-shell">
      {leftSidebarOpen && <LeftSidebar />}

      <div className="app-main">
        <div className="app-toolbar">
          <button
            type="button"
            className="toolbar-btn"
            onClick={toggleLeftSidebar}
          >
            {leftSidebarOpen ? '\u25C0' : '\u25B6'} Sidebar
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={toggleRightPanel}
          >
            Panel {rightPanelOpen ? '\u25B6' : '\u25C0'}
          </button>
        </div>
        <div className="app-content">{children}</div>
      </div>

      {rightPanelOpen && <RightPanel />}
    </div>
  );
}
