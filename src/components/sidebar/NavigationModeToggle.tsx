import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useAppStore } from '../../store';

export function NavigationModeToggle() {
  const navigationMode = useAppStore((s) => s.navigationMode);
  const setNavigationMode = useAppStore((s) => s.setNavigationMode);

  return (
    <div className="py-2">
      <div className="flex items-center px-2 pb-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Navigation
        </span>
      </div>
      <div className="px-2">
        <ToggleGroup
          type="single"
          value={navigationMode}
          onValueChange={(value) => {
            if (value) setNavigationMode(value as 'orbit' | 'first-person');
          }}
          size="sm"
          className="w-full gap-0.5"
        >
          <ToggleGroupItem
            value="orbit"
            className="flex-1 h-7 text-[11px] font-semibold data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            Orbit
          </ToggleGroupItem>
          <ToggleGroupItem
            value="first-person"
            className="flex-1 h-7 text-[11px] font-semibold data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            First-Person
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      {navigationMode === 'first-person' && (
        <p className="mx-2 mt-1.5 text-[10px] text-muted-foreground leading-snug">
          Click canvas to lock. WASD/arrows to move. R/F up/down. Shift = fast.
          Esc to unlock.
        </p>
      )}
    </div>
  );
}
