import { ReactNode, useState, useEffect } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useHasValidAdminSession } from '../../hooks/admin/useAdminSharedCodeGate';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { ShieldAlert, XCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from '@tanstack/react-router';
import AdminSharedCodeGateScreen from './AdminSharedCodeGateScreen';
import { isFullyVerified, clearAdminVerificationProgress } from '../../utils/adminSharedCodeSession';
import { useIsPermanentlyLocked } from '../../hooks/admin/useAdminVerificationStatus';
import AdminLockoutModal from './AdminLockoutModal';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { identity } = useInternetIdentity();
  const { data: hasValidSession, isLoading: isSessionLoading, refetch: refetchSessionStatus, isError: sessionError } = useHasValidAdminSession();
  const { data: isLocked, isLoading: isLockStatusLoading, isFetched: isLockStatusFetched, isError: lockStatusError } = useIsPermanentlyLocked();
  const [showVerificationGate, setShowVerificationGate] = useState(false);
  const [showLockoutModal, setShowLockoutModal] = useState(false);

  // Clear cached verification progress when lockout is detected
  useEffect(() => {
    if (isLocked) {
      clearAdminVerificationProgress();
    }
  }, [isLocked]);

  // Check session storage on mount and when verification status changes
  useEffect(() => {
    if (identity && !isLocked) {
      const sessionFullyVerified = isFullyVerified();
      if (!sessionFullyVerified && !hasValidSession) {
        setShowVerificationGate(true);
      } else {
        setShowVerificationGate(false);
      }
    }
  }, [identity, hasValidSession, isLocked]);

  // Show lockout modal when locked status is detected
  useEffect(() => {
    if (isLocked) {
      setShowLockoutModal(true);
    }
  }, [isLocked]);

  // Step 1: Check authentication
  if (!identity) {
    return (
      <div className="container max-w-2xl py-8 px-4 sm:py-16" data-guard-state="authentication-required">
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

  // Step 2: Check if permanently locked out (highest priority check)
  // Wait for lockout status to be fetched before proceeding
  if (isLockStatusLoading || !isLockStatusFetched) {
    return (
      <div className="container max-w-2xl py-8 px-4 sm:py-16" data-guard-state="checking-lockout-status">
        <p>Checking access status...</p>
      </div>
    );
  }

  // Handle lockout status error gracefully
  if (lockStatusError) {
    return (
      <div className="container max-w-2xl py-8 px-4 sm:py-16" data-guard-state="lockout-check-error">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Unable to Verify Access Status</AlertTitle>
          <AlertDescription>
            Could not verify your admin access status. Please try again later or contact support if the issue persists.
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

  if (isLocked) {
    return (
      <>
        <div className="container max-w-2xl py-8 px-4 sm:py-16" data-guard-state="permanently-locked">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Admin Access Permanently Locked</AlertTitle>
            <AlertDescription>
              Your account has been permanently locked out of admin access due to too many failed verification attempts. This action cannot be reversed. You still have full access to all non-admin website features.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Link to="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </div>
        <AdminLockoutModal 
          open={showLockoutModal} 
          onClose={() => setShowLockoutModal(false)} 
        />
      </>
    );
  }

  // Step 3: Check admin verification
  if (isSessionLoading) {
    return (
      <div className="container max-w-2xl py-8 px-4 sm:py-16" data-guard-state="checking-session">
        <p>Checking admin session...</p>
      </div>
    );
  }

  // Handle session check error gracefully
  if (sessionError) {
    return (
      <div className="container max-w-2xl py-8 px-4 sm:py-16" data-guard-state="session-check-error">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Unable to Verify Admin Session</AlertTitle>
          <AlertDescription>
            Could not verify your admin session. Please try again later or contact support if the issue persists.
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

  // Show verification gate if not verified
  if (showVerificationGate || !hasValidSession) {
    return (
      <AdminSharedCodeGateScreen
        onSuccess={() => {
          setShowVerificationGate(false);
          refetchSessionStatus();
        }}
      />
    );
  }

  // All checks passed - render admin content
  return <>{children}</>;
}
