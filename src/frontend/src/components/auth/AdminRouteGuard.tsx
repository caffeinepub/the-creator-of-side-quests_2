import { ReactNode, useState, useEffect } from 'react';
import { useIsAdmin } from '../../hooks/useCurrentUser';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useHasValidAdminSharedCode } from '../../hooks/admin/useAdminSharedCodeGate';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from '@tanstack/react-router';
import AdminSharedCodeGateScreen from './AdminSharedCodeGateScreen';
import { isAdminCodeVerified } from '../../utils/adminSharedCodeSession';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const { data: hasValidCode, isLoading: isCodeLoading, refetch: refetchCodeStatus } = useHasValidAdminSharedCode();
  const [showCodeGate, setShowCodeGate] = useState(false);

  // Check session storage on mount and when admin status changes
  useEffect(() => {
    if (isAdmin && !isAdminLoading) {
      const sessionVerified = isAdminCodeVerified();
      if (!sessionVerified && !hasValidCode) {
        setShowCodeGate(true);
      } else {
        setShowCodeGate(false);
      }
    }
  }, [isAdmin, isAdminLoading, hasValidCode]);

  // Step 1: Check authentication
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

  // Step 2: Check admin permission
  if (isAdminLoading) {
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

  // Step 3: Check shared code verification
  if (isCodeLoading) {
    return (
      <div className="container py-16">
        <p>Verifying admin access...</p>
      </div>
    );
  }

  const sessionVerified = isAdminCodeVerified();
  if (!sessionVerified && !hasValidCode) {
    return (
      <AdminSharedCodeGateScreen
        onSuccess={() => {
          setShowCodeGate(false);
          refetchCodeStatus();
        }}
      />
    );
  }

  // All checks passed, render admin content
  return <>{children}</>;
}
