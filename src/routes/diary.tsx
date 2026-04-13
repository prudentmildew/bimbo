import { createFileRoute } from '@tanstack/react-router';
import { ShellPlaceholder } from '../components/shell/ShellPlaceholder';

export const Route = createFileRoute('/diary')({
  component: () => (
    <ShellPlaceholder
      title="Project Diary"
      description="Daily logs of construction activities, weather conditions, workforce, and notable events for project documentation."
    />
  ),
});
