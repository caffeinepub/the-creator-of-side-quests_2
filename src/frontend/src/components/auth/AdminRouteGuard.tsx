import { ReactNode, useState, useEffect } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useHasValidAdminSession } from '../../hooks/admin/useAdminSharedCodeGate';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { ShieldAlert } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from '@tanstack/react-router';
import AdminSharedCodeGateScreen from './AdminSharedCodeGateScreen';
import { isFullyVerified } from '../../utils/adminSharedCodeSession';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { identity } = useInternetIdentity();
  const { data: hasValidSession, isLoading: isSessionLoading, refetch: refetchSessionStatus } = useHasValidAdminSession();
  const [showVerificationGate, setShowVerificationGate] = useState(false);

  // Check session storage on mount and when verification status changes
  useEffect(() => {
    if (identity) {
      const sessionFullyVerified = isFullyVerified();
      if (!sessionFullyVerified && !hasValidSession) {
        setShowVerificationGate(true);
      } else {
        setShowVerificationGate(false);
      }
    }
  }, [identity, hasValidSession]);

  // Step 1: Check authentication
  if (!identity) {
    return (
      <div className="container py-16" data-guard-state="authentication-required">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You must be logged in to access the admin panel. However, logging in alone does not grant admin access. Admin access requires completing a separate three-step verification process.
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

  // Step 2: Check admin verification (separate from login)
  if (isSessionLoading) {
    return (
      <div className="container py-16" data-guard-state="verifying-admin-access">
        <p>Verifying admin access...</p>
      </div>
    );
  }

  const sessionFullyVerified = isFullyVerified();
  if (!sessionFullyVerified && !hasValidSession) {
    return (
      <div data-guard-state="admin-verification-required">
        <AdminSharedCodeGateScreen
          onSuccess={() => {
            setShowVerificationGate(false);
            refetchSessionStatus();
          }}
        />
      </div>
    );
  }

  // All checks passed, render admin content
  return <div data-guard-state="authorized">{children}</div>;
}
