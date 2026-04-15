import * as React from 'react';

interface ToggleGroupContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  size?: 'default' | 'sm' | 'lg';
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue>({});

interface ToggleGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  type: 'single' | 'multiple';
  value?: string;
  onValueChange?: (value: string) => void;
  size?: 'default' | 'sm' | 'lg';
}

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ className, value, onValueChange, size = 'default', children, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const items = Array.from(
        e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]'),
      );
      const current = items.indexOf(e.target as HTMLButtonElement);
      if (current === -1) return;

      let next = current;
      if (e.key === 'ArrowRight') next = (current + 1) % items.length;
      else if (e.key === 'ArrowLeft') next = (current - 1 + items.length) % items.length;
      else return;

      e.preventDefault();
      items[next].focus();
      items[next].click();
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        className={['toggle-group', className].filter(Boolean).join(' ')}
        onKeyDown={handleKeyDown}
        {...props}
      >
        <ToggleGroupContext.Provider value={{ value, onValueChange, size }}>
          {children}
        </ToggleGroupContext.Provider>
      </div>
    );
  },
);
ToggleGroup.displayName = 'ToggleGroup';

interface ToggleGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext);
    const isOn = context.value === value;

    const classes = [
      'toggle-group-item',
      context.size === 'sm' ? 'toggle-sm' : '',
      isOn ? 'pressed' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type="button"
        role="radio"
        aria-checked={isOn}
        tabIndex={isOn ? 0 : -1}
        className={classes}
        onClick={() => context.onValueChange?.(value)}
        {...props}
      >
        {children}
      </button>
    );
  },
);
ToggleGroupItem.displayName = 'ToggleGroupItem';

export { ToggleGroup, ToggleGroupItem };
