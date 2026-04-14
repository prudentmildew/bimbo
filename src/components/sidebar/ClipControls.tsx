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
    <div className="sidebar-panel">
      <div className="sidebar-panel-header">
        <span className="mono-label">Clip Plane</span>
        <div className="clip-toggle">
          <span className="clip-toggle-label">
            {clipPlane.enabled ? 'On' : 'Off'}
          </span>
          <Switch
            checked={clipPlane.enabled}
            onCheckedChange={(enabled) => setClipPlane({ enabled })}
          />
        </div>
      </div>

      {clipPlane.enabled && (
        <div className="clip-controls">
          <div className="clip-row">
            <span className="clip-label">Axis</span>
            <ToggleGroup
              type="single"
              value={clipPlane.axis}
              onValueChange={(value) => {
                if (value) setClipPlane({ axis: value as 'x' | 'y' | 'z' });
              }}
              size="sm"
            >
              {AXES.map((axis) => (
                <ToggleGroupItem key={axis} value={axis}>
                  {axis.toUpperCase()}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <div className="clip-row">
            <span className="clip-label">Position</span>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={[clipPlane.position]}
              onValueChange={([position]) => setClipPlane({ position })}
              className="clip-slider"
            />
          </div>

          <div className="clip-row">
            <span className="clip-label">Direction</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setClipPlane({ flipped: !clipPlane.flipped })}
            >
              {clipPlane.flipped ? '\u21C5 Flipped' : '\u21C5 Normal'}
            </Button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={resetClipPlane}
            className="clip-reset-btn"
          >
            Reset
          </Button>
        </div>
      )}
    </div>
  );
}
