import * as React from 'react';

interface SwitchProps {
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked = false, disabled, onCheckedChange, className }, ref) => {
    const classes = ['switch', checked ? 'checked' : '', className]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={classes}
        onClick={() => onCheckedChange?.(!checked)}
      >
        <span className="switch-thumb" />
      </button>
    );
  },
);
Switch.displayName = 'Switch';

export { Switch };
