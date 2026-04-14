import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { LogOut, Trash2 } from 'lucide-react';
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
          <button type="button" className="user-menu-trigger">
            <div className="user-avatar">{initial}</div>
            <div className="user-info">
              <p className="user-name">{currentUser.firstName}</p>
              <Badge variant="secondary" className="user-role-badge">
                {roleLabel}
              </Badge>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="user-menu-content">
          <DropdownMenuLabel className="user-menu-label">
            <div className="user-menu-profile">
              <p className="user-menu-fullname">{fullName}</p>
              <p className="user-menu-email">{currentUser.email}</p>
              <Badge variant="outline" className="user-menu-role-badge">
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
            className="user-menu-danger"
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
