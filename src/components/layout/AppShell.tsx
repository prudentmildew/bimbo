import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '../../store';
import { LeftSidebar } from './LeftSidebar';
import { RightPanel } from './RightPanel';

export function AppShell({ children }: { children: ReactNode }) {
  const leftSidebarOpen = useAppStore((s) => s.leftSidebarOpen);
  const rightPanelOpen = useAppStore((s) => s.rightPanelOpen);
  const toggleLeftSidebar = useAppStore((s) => s.toggleLeftSidebar);
  const toggleRightPanel = useAppStore((s) => s.toggleRightPanel);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {leftSidebarOpen && <LeftSidebar />}

      <div className="relative flex flex-col flex-1 min-w-0">
        <div className="absolute top-2 left-2 z-10 flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLeftSidebar}
            className="h-7 px-2 text-xs bg-card/80 backdrop-blur-sm border border-border hover:bg-secondary"
          >
            {leftSidebarOpen ? '\u25C0' : '\u25B6'} Sidebar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleRightPanel}
            className="h-7 px-2 text-xs bg-card/80 backdrop-blur-sm border border-border hover:bg-secondary"
          >
            Panel {rightPanelOpen ? '\u25B6' : '\u25C0'}
          </Button>
        </div>
        <div className="flex-1">{children}</div>
      </div>

      {rightPanelOpen && <RightPanel />}
    </div>
  );
}
