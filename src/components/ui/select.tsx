import { Check, ChevronDown } from 'lucide-react';
import * as React from 'react';
import { useEffect, useRef, useState, useCallback } from 'react';

interface SelectContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const SelectContext = React.createContext<SelectContextValue>({
  open: false,
  setOpen: () => {},
  triggerRef: { current: null },
});

interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

function Select({ value, defaultValue, onValueChange, children }: SelectProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const activeValue = value ?? internalValue;
  const handleChange = useCallback(
    (v: string) => {
      onValueChange?.(v);
      if (value === undefined) setInternalValue(v);
    },
    [onValueChange, value],
  );

  return (
    <SelectContext.Provider
      value={{
        value: activeValue,
        onValueChange: handleChange,
        open,
        setOpen,
        triggerRef,
      }}
    >
      <div className="select-root">{children}</div>
    </SelectContext.Provider>
  );
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen, triggerRef } = React.useContext(SelectContext);

    return (
      <button
        ref={(node) => {
          (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        className={['select-trigger', className].filter(Boolean).join(' ')}
        onClick={() => setOpen(!open)}
        {...props}
      >
        {children}
        <ChevronDown className="select-icon" />
      </button>
    );
  },
);
SelectTrigger.displayName = 'SelectTrigger';

function SelectValue({ placeholder }: { placeholder?: string }) {
  const { value } = React.useContext(SelectContext);
  return <span className="select-value">{value || placeholder}</span>;
}

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function SelectContent({ className, children, ...props }: SelectContentProps) {
  const { open, setOpen, triggerRef } = React.useContext(SelectContext);
  const contentRef = useRef<HTMLDivElement>(null);
  const [focusIndex, setFocusIndex] = useState(-1);

  // Click outside
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        contentRef.current &&
        !contentRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, setOpen, triggerRef]);

  // Keyboard nav
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const items = contentRef.current?.querySelectorAll<HTMLElement>(
        '[role="option"]',
      );
      if (!items?.length) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = (focusIndex + 1) % items.length;
        setFocusIndex(next);
        items[next].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = (focusIndex - 1 + items.length) % items.length;
        setFocusIndex(prev);
        items[prev].focus();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (focusIndex >= 0 && items[focusIndex]) {
          items[focusIndex].click();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, focusIndex, setOpen, triggerRef]);

  useEffect(() => {
    if (!open) setFocusIndex(-1);
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      role="listbox"
      className={['select-content', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
}

function SelectItem({
  value,
  disabled,
  className,
  children,
  ...props
}: SelectItemProps) {
  const { value: selectedValue, onValueChange, setOpen } =
    React.useContext(SelectContext);
  const isSelected = selectedValue === value;

  const handleClick = () => {
    if (disabled) return;
    onValueChange?.(value);
    setOpen(false);
  };

  return (
    <div
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      className={['select-item', isSelected ? 'selected' : '', disabled ? 'disabled' : '', className]
        .filter(Boolean)
        .join(' ')}
      onClick={handleClick}
      {...props}
    >
      <span className="select-item-indicator">
        {isSelected && <Check className="select-item-check" />}
      </span>
      {children}
    </div>
  );
}

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
};
