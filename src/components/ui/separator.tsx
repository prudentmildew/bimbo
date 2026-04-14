import * as React from 'react';

interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
}

const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(
  ({ className, orientation = 'horizontal', ...props }, ref) => (
    <hr
      ref={ref}
      className={[
        orientation === 'vertical' ? 'separator-vertical' : 'separator',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  ),
);
Separator.displayName = 'Separator';

export { Separator };
