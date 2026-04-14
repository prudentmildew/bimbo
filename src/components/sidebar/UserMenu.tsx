import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { LogOut, Trash2, User } from 'lucide-react';
import { useAppStore } from '@/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { UserRole } from '@/features/auth';

const ROLE_LABELS: Record<UserRole, string> = {
  owner: 'Owner',
  customer_admin: 'Customer Admin',
  project_admin: 'Project Admin',
  workflow_admin: 'Workflow Admin',
  user: 'User',
  guest: 'Guest',
};

export function UserMenu() {
  const currentUser = useAppStore((s) => s.currentUser);
  const signOut = useAppStore((s) => s.signOut);
  const deleteAccount = useAppStore((s) => s.deleteAccount);
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (!currentUser) return null;

  const initial = currentUser.firstName.charAt(0).toUpperCase();
  const fullName = `${currentUser.firstName} ${currentUser.lastName}`;
  const roleLabel = ROLE_LABELS[currentUser.role];

  function handleSignOut() {
    signOut();
    navigate({ to: '/login' });
  }

  function handleDeleteConfirm() {
    deleteAccount();
    setDeleteDialogOpen(false);
    navigate({ to: '/login' });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex w-full items-center gap-2.5 rounded px-2 py-2 text-left hover:bg-secondary transition-colors"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="m-0 truncate text-[13px] font-medium text-foreground">
                {currentUser.firstName}
              </p>
              <Badge
                variant="secondary"
                className="mt-0.5 h-4 px-1 text-[9px] font-mono text-muted-foreground"
              >
                {roleLabel}
              </Badge>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1">
              <p className="m-0 text-sm font-medium">{fullName}</p>
              <p className="m-0 text-xs text-muted-foreground">
                {currentUser.email}
              </p>
              <Badge
                variant="outline"
                className="mt-0.5 w-fit text-[10px] font-mono"
              >
                {roleLabel}
              </Badge>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={handleSignOut}>
            <LogOut />
            Sign Out
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setDeleteDialogOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 />
            Delete Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
