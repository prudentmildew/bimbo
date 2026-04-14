import * as React from 'react';

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (
    {
      pressed = false,
      onPressedChange,
      variant = 'default',
      size = 'default',
      className,
      onClick,
      ...props
    },
    ref,
  ) => {
    const classes = [
      'toggle',
      `toggle-${variant}`,
      size !== 'default' ? `toggle-${size}` : '',
      pressed ? 'pressed' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={pressed}
        className={classes}
        onClick={(e) => {
          onPressedChange?.(!pressed);
          onClick?.(e);
        }}
        {...props}
      />
    );
  },
);
Toggle.displayName = 'Toggle';

export { Toggle };
