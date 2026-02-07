import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { ShieldCheck, AlertCircle, CheckCircle2, XCircle, Key } from 'lucide-react';
import {
  useVerifyAdminCodeStep1,
  useVerifyAdminCodeStep2,
  useVerifyAdminCodeStep3,
  useVerifyAdminMasterOverride,
} from '../../hooks/admin/useAdminSharedCodeGate';
import {
  setAdminVerificationProgress,
  getAdminVerificationProgress,
  clearAdminVerificationProgress,
  setFullyVerified,
  type AdminVerificationProgress,
} from '../../utils/adminSharedCodeSession';
import { useAdminVerificationStatus } from '../../hooks/admin/useAdminVerificationStatus';
import AdminLockoutModal from './AdminLockoutModal';

interface AdminSharedCodeGateScreenProps {
  onSuccess: () => void;
}

export default function AdminSharedCodeGateScreen({ onSuccess }: AdminSharedCodeGateScreenProps) {
  const [currentStep, setCurrentStep] = useState<AdminVerificationProgress>(
    getAdminVerificationProgress()
  );
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showLockoutModal, setShowLockoutModal] = useState(false);
  const [useMasterOverride, setUseMasterOverride] = useState(false);

  const { data: verificationStatus, refetch: refetchStatus } = useAdminVerificationStatus();
  const verifyStep1 = useVerifyAdminCodeStep1();
  const verifyStep2 = useVerifyAdminCodeStep2();
  const verifyStep3 = useVerifyAdminCodeStep3();
  const verifyMasterOverride = useVerifyAdminMasterOverride();

  const isVerifying = verifyStep1.isPending || verifyStep2.isPending || verifyStep3.isPending || verifyMasterOverride.isPending;
  const isLocked = verificationStatus?.permanently_locked ?? false;

  // Show lockout modal immediately when locked status is detected
  useEffect(() => {
    if (isLocked) {
      setShowLockoutModal(true);
      // Clear any cached verification progress when locked out
      clearAdminVerificationProgress();
      setCurrentStep(0);
    }
  }, [isLocked]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLocked) {
      setError('Access denied. Maximum verification attempts exceeded.');
      return;
    }

    if (!code.trim()) {
      setError('Please enter the verification code.');
      return;
    }

    try {
      if (currentStep === 0 && useMasterOverride) {
        // Master Override mode
        await verifyMasterOverride.mutateAsync(code);
        setFullyVerified();
        setCurrentStep(3);
        onSuccess();
      } else if (currentStep === 0) {
        await verifyStep1.mutateAsync(code);
        setAdminVerificationProgress(1);
        setCurrentStep(1);
        setCode('');
      } else if (currentStep === 1) {
        await verifyStep2.mutateAsync(code);
        setAdminVerificationProgress(2);
        setCurrentStep(2);
        setCode('');
      } else if (currentStep === 2) {
        await verifyStep3.mutateAsync(code);
        setAdminVerificationProgress(3);
        setCurrentStep(3);
        onSuccess();
      }
    } catch (err: any) {
      // Refresh lockout status after any failed attempt
      await refetchStatus();
      // Show generic error message without exposing sensitive details
      setError('Verification failed. Please check your code and try again.');
    }
  };

  const getStepTitle = () => {
    if (currentStep === 0) return 'Step 1 of 3';
    if (currentStep === 1) return 'Step 2 of 3';
    if (currentStep === 2) return 'Step 3 of 3';
    return 'Verification Complete';
  };

  const getStepDescription = () => {
    if (isLocked) {
      return 'Access denied. Your account has been permanently locked due to too many failed verification attempts.';
    }
    if (currentStep === 0 && useMasterOverride) {
      return 'Enter the Master Override Code to bypass all verification steps and gain immediate admin access.';
    }
    if (currentStep === 0) {
      return 'Admin access requires completing a three-step verification process. Enter Code #1 to begin.';
    }
    if (currentStep === 1) {
      return 'Step 1 complete. Enter Code #2 to continue.';
    }
    if (currentStep === 2) {
      return 'Step 2 complete. Enter Code #3 to complete verification and gain admin access.';
    }
    return 'All verification steps completed successfully.';
  };

  const remainingAttempts = verificationStatus?.remaining_attempts 
    ? Number(verificationStatus.remaining_attempts) 
    : null;

  return (
    <>
      <div className="container flex min-h-screen items-center justify-center py-16">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
              isLocked ? 'bg-destructive/10' : 'bg-primary/10'
            }`}>
              {isLocked ? (
                <XCircle className="h-6 w-6 text-destructive" />
              ) : useMasterOverride && currentStep === 0 ? (
                <Key className="h-6 w-6 text-primary" />
              ) : (
                <ShieldCheck className="h-6 w-6 text-primary" />
              )}
            </div>
            <CardTitle>Admin Access Verification</CardTitle>
            <CardDescription className="text-base font-medium">{getStepTitle()}</CardDescription>
            <CardDescription className="mt-2">{getStepDescription()}</CardDescription>
            {!isLocked && remainingAttempts !== null && (
              <CardDescription className="mt-2 text-sm font-semibold text-warning">
                Remaining attempts: {remainingAttempts}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {!isLocked && (
              <>
                <div className="mb-6 flex items-center justify-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {currentStep >= 1 ? <CheckCircle2 className="h-4 w-4" /> : '1'}
                  </div>
                  <div className={`h-1 w-12 ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {currentStep >= 2 ? <CheckCircle2 className="h-4 w-4" /> : '2'}
                  </div>
                  <div className={`h-1 w-12 ${currentStep >= 3 ? 'bg-primary' : 'bg-muted'}`} />
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {currentStep >= 3 ? <CheckCircle2 className="h-4 w-4" /> : '3'}
                  </div>
                </div>

                {currentStep === 0 && (
                  <div className="mb-4 flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant={!useMasterOverride ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setUseMasterOverride(false);
                        setCode('');
                        setError(null);
                      }}
                      disabled={isVerifying}
                    >
                      Code #1
                    </Button>
                    <Button
                      type="button"
                      variant={useMasterOverride ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        setUseMasterOverride(true);
                        setCode('');
                        setError(null);
                      }}
                      disabled={isVerifying}
                    >
                      <Key className="mr-2 h-4 w-4" />
                      Master Override
                    </Button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-code">
                      {currentStep === 0 && useMasterOverride && 'Master Override Code'}
                      {currentStep === 0 && !useMasterOverride && 'Code #1'}
                      {currentStep === 1 && 'Code #2'}
                      {currentStep === 2 && 'Code #3'}
                    </Label>
                    <Input
                      id="admin-code"
                      type="password"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder={
                        currentStep === 0 && useMasterOverride
                          ? 'Enter Master Override Code'
                          : 'Enter verification code'
                      }
                      disabled={isVerifying}
                      autoFocus
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isVerifying}>
                    {isVerifying 
                      ? 'Verifying...' 
                      : currentStep === 0 && useMasterOverride
                      ? 'Verify Master Override'
                      : currentStep === 2 
                      ? 'Complete Verification' 
                      : 'Continue'}
                  </Button>
                </form>
              </>
            )}

            {isLocked && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Access denied. Your account has been permanently locked due to exceeding the maximum number of failed verification attempts.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      <AdminLockoutModal 
        open={showLockoutModal} 
        onClose={() => setShowLockoutModal(false)} 
      />
    </>
  );
}
