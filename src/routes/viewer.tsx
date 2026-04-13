import { createFileRoute } from '@tanstack/react-router';
import { ViewerCanvas } from '../components/viewer/ViewerCanvas';

export const Route = createFileRoute('/viewer')({
  component: ViewerPage,
});

function ViewerPage() {
  return <ViewerCanvas />;
}
