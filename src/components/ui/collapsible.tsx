import * as React from 'react';

interface CollapsibleContextValue {
  open: boolean;
  onToggle: () => void;
}

const CollapsibleContext = React.createContext<CollapsibleContextValue>({
  open: false,
  onToggle: () => {},
});

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function Collapsible({ open = false, onOpenChange, className, children, ...props }: CollapsibleProps) {
  const ctx = React.useMemo(
    () => ({ open, onToggle: () => onOpenChange?.(!open) }),
    [open, onOpenChange],
  );

  return (
    <CollapsibleContext.Provider value={ctx}>
      <div
        className={['collapsible', className].filter(Boolean).join(' ')}
        data-state={open ? 'open' : 'closed'}
        {...props}
      >
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}

interface CollapsibleTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ className, onClick, ...props }, ref) => {
    const { open, onToggle } = React.useContext(CollapsibleContext);

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={open}
        className={['collapsible-trigger', className].filter(Boolean).join(' ')}
        onClick={(e) => {
          onToggle();
          onClick?.(e);
        }}
        {...props}
      />
    );
  },
);
CollapsibleTrigger.displayName = 'CollapsibleTrigger';

const CollapsibleContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { open } = React.useContext(CollapsibleContext);

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
