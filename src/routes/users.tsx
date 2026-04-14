import { createFileRoute } from '@tanstack/react-router';
import { useAppStore } from '@/store';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type UserRole, canEditRole } from '@/features/auth';

const ALL_ROLES: { value: UserRole; label: string }[] = [
  { value: 'owner', label: 'Owner' },
  { value: 'customer_admin', label: 'Customer Admin' },
  { value: 'project_admin', label: 'Project Admin' },
  { value: 'workflow_admin', label: 'Workflow Admin' },
  { value: 'user', label: 'User' },
  { value: 'guest', label: 'Guest' },
];

const ROLE_LABELS: Record<UserRole, string> = Object.fromEntries(
  ALL_ROLES.map((r) => [r.value, r.label]),
) as Record<UserRole, string>;

export const Route = createFileRoute('/users')({
  component: UsersPage,
});

function UsersPage() {
  const currentUser = useAppStore((s) => s.currentUser);
  const registeredUsers = useAppStore((s) => s.registeredUsers);
  const updateUserRole = useAppStore((s) => s.updateUserRole);

  if (!currentUser) return null;

  const editorRole = currentUser.role;

  return (
    <div className="h-full overflow-auto p-6">
      <h2 className="m-0 mb-4 text-xl font-bold text-foreground">
        User Management
      </h2>
      <div className="rounded-md border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Name
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Email
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Role
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {registeredUsers.map((user) => {
              const isCurrentUser = user.id === currentUser.id;
              const editable = canEditRole(editorRole, user.role) && !isCurrentUser;

              return (
                <tr
                  key={user.id}
                  className={`border-b border-border last:border-b-0 ${
                    isCurrentUser ? 'bg-primary/5' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-foreground">
                    {user.firstName} {user.lastName}
                    {isCurrentUser && (
                      <Badge
                        variant="outline"
                        className="ml-2 text-[10px] font-mono"
                      >
                        You
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    {editable ? (
                      <Select
                        value={user.role}
                        onValueChange={(value) =>
                          updateUserRole(user.id, value as UserRole)
                        }
                      >
                        <SelectTrigger className="h-8 w-[160px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ALL_ROLES.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-muted-foreground">
                        {ROLE_LABELS[user.role]}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
