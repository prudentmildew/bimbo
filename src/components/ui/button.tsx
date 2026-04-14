import * as React from 'react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost' | 'destructive' | 'outline' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const classes = [
      'btn',
      `btn-${variant}`,
      size !== 'default' ? `btn-${size}` : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return <button ref={ref} className={classes} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button };
