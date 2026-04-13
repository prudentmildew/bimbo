import { createFileRoute } from '@tanstack/react-router';
import { ShellPlaceholder } from '../components/shell/ShellPlaceholder';

export const Route = createFileRoute('/documents')({
  component: () => (
    <ShellPlaceholder
      title="Document Management"
      description="Upload, label, and control access to project documents with version tracking and discipline-based organization."
    />
  ),
});
