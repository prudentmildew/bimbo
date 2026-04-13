import { createFileRoute } from '@tanstack/react-router';
import { ShellPlaceholder } from '../components/shell/ShellPlaceholder';

export const Route = createFileRoute('/users')({
  component: () => (
    <ShellPlaceholder
      title="User & Access Management"
      description="Manage user roles, permissions, and groups with enterprise administration and access control policies."
    />
  ),
});
