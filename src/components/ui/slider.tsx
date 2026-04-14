import * as React from 'react';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number[];
  onValueChange?: (value: number[]) => void;
  disabled?: boolean;
  className?: string;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ min = 0, max = 100, step = 1, value = [0], onValueChange, disabled, className }, ref) => {
    const classes = ['slider', className].filter(Boolean).join(' ');

    return (
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        disabled={disabled}
        className={classes}
        onChange={(e) => onValueChange?.([Number(e.target.value)])}
      />
    );
  },
);
Slider.displayName = 'Slider';

export { Slider };
