import * as React from 'react';

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function Collapsible({ open, onOpenChange, className, children, ...props }: CollapsibleProps) {
  return (
    <div
      className={['collapsible', className].filter(Boolean).join(' ')}
      data-state={open ? 'open' : 'closed'}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        if (
          child.type === CollapsibleTrigger ||
          child.type === CollapsibleContent
        ) {
          return React.cloneElement(child as React.ReactElement<{ open?: boolean; onToggle?: () => void }>, {
            open,
            onToggle: () => onOpenChange?.(!open),
          });
        }
        return child;
      })}
    </div>
  );
}

interface CollapsibleTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  open?: boolean;
  onToggle?: () => void;
}

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ open, onToggle, className, onClick, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-expanded={open}
      className={['collapsible-trigger', className].filter(Boolean).join(' ')}
      onClick={(e) => {
        onToggle?.();
        onClick?.(e);
      }}
      {...props}
    />
  ),
);
CollapsibleTrigger.displayName = 'CollapsibleTrigger';

interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
}

const CollapsibleContent = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ open, className, ...props }, ref) => {
    if (!open) return null;

    return (
      <div
        ref={ref}
        className={['collapsible-content', className].filter(Boolean).join(' ')}
        {...props}
      />
    );
  },
);
CollapsibleContent.displayName = 'CollapsibleContent';

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
