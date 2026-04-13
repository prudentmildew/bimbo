import { Link, useLocation } from '@tanstack/react-router';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
    <aside className="flex flex-col w-[260px] shrink-0 border-r border-border bg-card">
      <div className="p-3 border-b border-border">
        <h1 className="m-0 text-lg font-bold text-foreground">bimbo</h1>
        <p className="m-0 text-[11px] font-mono text-muted-foreground">
          v0.0.0-dev
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          <LayerPanel />
          <Separator className="my-2" />
          <ClipControls />
          <Separator className="my-2" />
          <NavigationModeToggle />
          <Separator className="my-2" />
          <p className="m-0 mb-1 px-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Modules
          </p>
          {modules.map((m) => {
            const isActive = location.pathname === m.path;
            return (
              <Link
                key={m.path}
                to={m.path}
                className={`flex items-center gap-2 rounded px-2 py-1.5 text-[13px] no-underline ${
                  isActive
                    ? 'bg-secondary text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {m.label}
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
