import { Check } from 'lucide-react';
import * as React from 'react';

interface CheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ checked = false, disabled, onCheckedChange, className }, ref) => {
    const classes = [
      'checkbox',
      checked ? 'checked' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        className={classes}
        onClick={() => onCheckedChange?.(!checked)}
      >
        {checked && <Check className="checkbox-icon" />}
      </button>
    );
  },
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
