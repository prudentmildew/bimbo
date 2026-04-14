import {
  Outlet,
  createRootRoute,
  redirect,
  useLocation,
} from '@tanstack/react-router';
import { AppShell } from '../components/layout/AppShell';
import { getAppStore } from '../store';

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    const { currentUser } = getAppStore().getState();

    if (!currentUser && location.pathname !== '/login') {
      throw redirect({ to: '/login' });
    }

    if (currentUser && location.pathname === '/login') {
      throw redirect({ to: '/viewer' });
    }
  },
  component: RootComponent,
});

function RootComponent() {
  const location = useLocation();

  if (location.pathname === '/login') {
    return <Outlet />;
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
