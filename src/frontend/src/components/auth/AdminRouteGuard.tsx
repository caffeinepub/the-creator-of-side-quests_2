import { ReactNode } from 'react';
import { useIsAdmin } from '../../hooks/useCurrentUser';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from '@tanstack/react-router';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsAdmin();

  if (!identity) {
    return (
      <div className="container py-16">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You must be logged in to access the admin panel.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-16">
        <p>Verifying permissions...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-16">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access the admin panel.
          </AlertDescription>
        </Alert>
        <div className="mt-4">
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
