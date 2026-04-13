import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useAppStore } from '../../store';

const AXES = ['x', 'y', 'z'] as const;

export function ClipControls() {
  const clipPlane = useAppStore((s) => s.clipPlane);
  const setClipPlane = useAppStore((s) => s.setClipPlane);
  const resetClipPlane = useAppStore((s) => s.resetClipPlane);

  return (
    <div className="py-2">
      <div className="flex items-center justify-between px-2 pb-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          Clip Plane
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground">
            {clipPlane.enabled ? 'On' : 'Off'}
          </span>
          <Switch
            checked={clipPlane.enabled}
            onCheckedChange={(enabled) => setClipPlane({ enabled })}
            className="h-4 w-7 data-[state=checked]:bg-primary data-[state=unchecked]:bg-secondary [&_span]:h-3 [&_span]:w-3 [&_span]:data-[state=checked]:translate-x-3"
          />
        </div>
      </div>

      {clipPlane.enabled && (
        <div className="px-2 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground w-13 shrink-0">
              Axis
            </span>
            <ToggleGroup
              type="single"
              value={clipPlane.axis}
              onValueChange={(value) => {
                if (value) setClipPlane({ axis: value as 'x' | 'y' | 'z' });
              }}
              size="sm"
              className="gap-0.5"
            >
              {AXES.map((axis) => (
                <ToggleGroupItem
                  key={axis}
                  value={axis}
                  className="h-6 px-2 text-[11px] font-semibold data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  {axis.toUpperCase()}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground w-13 shrink-0">
              Position
            </span>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[clipPlane.position]}
              onValueChange={([position]) => setClipPlane({ position })}
              className="flex-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground w-13 shrink-0">
              Direction
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setClipPlane({ flipped: !clipPlane.flipped })}
              className="h-6 px-2 text-[11px]"
            >
              {clipPlane.flipped ? '\u21C5 Flipped' : '\u21C5 Normal'}
            </Button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={resetClipPlane}
            className="w-full h-7 text-[11px]"
          >
            Reset
          </Button>
        </div>
      )}
    </div>
  );
}
