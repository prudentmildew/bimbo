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
import { type UserRole, canEditRole, assignableRoles } from '@/features/auth';

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
  const allowedRoles = assignableRoles(editorRole);

  return (
    <div className="users-page">
      <h2 className="users-title">User Management</h2>
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr className="users-table-head-row">
              <th className="users-th">Name</th>
              <th className="users-th">Email</th>
              <th className="users-th">Role</th>
              <th className="users-th">Joined</th>
            </tr>
          </thead>
          <tbody>
            {registeredUsers.map((user) => {
              const isCurrentUser = user.id === currentUser.id;
              const editable = canEditRole(editorRole, user.role) && !isCurrentUser;

              return (
                <tr
                  key={user.id}
                  className={`users-tr ${isCurrentUser ? 'current' : ''}`}
                >
                  <td className="users-td">
                    {user.firstName} {user.lastName}
                    {isCurrentUser && (
                      <Badge variant="outline" className="users-you-badge">
                        You
                      </Badge>
                    )}
                  </td>
                  <td className="users-td muted">{user.email}</td>
                  <td className="users-td">
                    {editable ? (
                      <Select
                        value={user.role}
                        onValueChange={(value) =>
                          updateUserRole(user.id, value as UserRole)
                        }
                      >
                        <SelectTrigger className="users-role-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ALL_ROLES.filter((role) =>
                            allowedRoles.includes(role.value),
                          ).map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="users-role-text">
                        {ROLE_LABELS[user.role]}
                      </span>
                    )}
                  </td>
                  <td className="users-td muted">
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
