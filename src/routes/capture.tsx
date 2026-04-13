import { createFileRoute } from '@tanstack/react-router';
import { ShellPlaceholder } from '../components/shell/ShellPlaceholder';

export const Route = createFileRoute('/capture')({
  component: () => (
    <ShellPlaceholder
      title="Capture"
      description="Track and manage issues with topic workflows, status management, and location-linked captures in the 3D model."
    />
  ),
});
