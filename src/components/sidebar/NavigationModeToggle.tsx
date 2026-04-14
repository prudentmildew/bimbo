import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useAppStore } from '../../store';

export function NavigationModeToggle() {
  const navigationMode = useAppStore((s) => s.navigationMode);
  const setNavigationMode = useAppStore((s) => s.setNavigationMode);

  return (
    <div className="sidebar-panel">
      <div className="sidebar-panel-header">
        <span className="mono-label">Navigation</span>
      </div>
      <div className="sidebar-panel-content">
        <ToggleGroup
          type="single"
          value={navigationMode}
          onValueChange={(value) => {
            if (value) setNavigationMode(value as 'orbit' | 'first-person');
          }}
          size="sm"
          className="nav-toggle-group"
        >
          <ToggleGroupItem value="orbit" className="nav-toggle-item">
            Orbit
          </ToggleGroupItem>
          <ToggleGroupItem value="first-person" className="nav-toggle-item">
            First-Person
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {navigationMode === 'first-person' && (
        <p className="nav-hint">
          Click canvas to lock. WASD/arrows to move. R/F up/down. Shift = fast.
          Esc to unlock.
        </p>
      )}
    </div>
  );
}
