import { X } from 'lucide-react';
import * as React from 'react';
import { useEffect, useRef } from 'react';

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    const handleClose = () => onOpenChange?.(false);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onOpenChange?.(false);
      }
    };

    el.addEventListener('close', handleClose);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      el.removeEventListener('close', handleClose);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onOpenChange]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onOpenChange?.(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      {children}
    </dialog>
  );
}

function DialogContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={['dialog-content', className].filter(Boolean).join(' ')} {...props}>
      {children}
    </div>
  );
}

function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={['dialog-header', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={['dialog-footer', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  id,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      id={id}
      className={['dialog-title', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={['dialog-description', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}

function DialogClose({ onClose }: { onClose: () => void }) {
  return (
    <button type="button" className="dialog-close" onClick={onClose}>
      <X className="dialog-close-icon" />
      <span className="sr-only">Close</span>
    </button>
  );
}

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
};
