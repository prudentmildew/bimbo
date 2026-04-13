import { createFileRoute } from '@tanstack/react-router';
import { ShellPlaceholder } from '../components/shell/ShellPlaceholder';

export const Route = createFileRoute('/reports')({
  component: () => (
    <ShellPlaceholder
      title="Power BI / Reports"
      description="Integrated Power BI dashboards and reports for project analytics, progress tracking, and data visualization."
    />
  ),
});
