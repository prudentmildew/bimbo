import { createFileRoute } from '@tanstack/react-router';
import { ShellPlaceholder } from '../components/shell/ShellPlaceholder';

export const Route = createFileRoute('/takt')({
  component: () => (
    <ShellPlaceholder
      title="Takt Planning"
      description="Plan and visualize construction sequences with takt time scheduling, zone-based workflows, and progress monitoring."
    />
  ),
});
