import type * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const classes = ['badge', `badge-${variant}`, className]
    .filter(Boolean)
    .join(' ');

  return <span className={classes} {...props} />;
}

export { Badge };
