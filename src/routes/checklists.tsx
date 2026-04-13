import { createFileRoute } from '@tanstack/react-router';
import { ShellPlaceholder } from '../components/shell/ShellPlaceholder';

export const Route = createFileRoute('/checklists')({
  component: () => (
    <ShellPlaceholder
      title="Checklists"
      description="Create and manage quality checklists with control methods, item tracking, and Excel export capabilities."
    />
  ),
});
