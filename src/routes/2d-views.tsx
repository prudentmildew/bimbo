import { createFileRoute } from '@tanstack/react-router';
import { ShellPlaceholder } from '../components/shell/ShellPlaceholder';

export const Route = createFileRoute('/2d-views')({
  component: () => (
    <ShellPlaceholder
      title="2D Views"
      description="View and navigate 2D floor plans with layer controls, transparency adjustments, and overlay support for comparing disciplines."
    />
  ),
});
