import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  useVerifyAdminCodeStep1,
  useVerifyAdminCodeStep2,
  useVerifyAdminCodeStep3,
} from '../../hooks/admin/useAdminSharedCodeGate';
import {
  setAdminVerificationProgress,
  getAdminVerificationProgress,
  type AdminVerificationProgress,
} from '../../utils/adminSharedCodeSession';

interface AdminSharedCodeGateScreenProps {
  onSuccess: () => void;
}

export default function AdminSharedCodeGateScreen({ onSuccess }: AdminSharedCodeGateScreenProps) {
  const [currentStep, setCurrentStep] = useState<AdminVerificationProgress>(
    getAdminVerificationProgress()
  );
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const verifyStep1 = useVerifyAdminCodeStep1();
  const verifyStep2 = useVerifyAdminCodeStep2();
  const verifyStep3 = useVerifyAdminCodeStep3();

  const isVerifying = verifyStep1.isPending || verifyStep2.isPending || verifyStep3.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!code.trim()) {
      setError('Please enter the verification code.');
      return;
    }

    try {
      if (currentStep === 0) {
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
      setError(err.message || 'Verification failed. Please try again.');
    }
  };

  const getStepTitle = () => {
    if (currentStep === 0) return 'Step 1 of 3';
    if (currentStep === 1) return 'Step 2 of 3';
    if (currentStep === 2) return 'Step 3 of 3';
    return 'Verification Complete';
  };

  const getStepDescription = () => {
    if (currentStep === 0) {
      return 'Being logged in does not grant admin access. Admin access requires completing a separate three-step verification process. Enter the first verification code to begin.';
    }
    if (currentStep === 1) {
      return 'Step 1 complete. Enter the second verification code to continue.';
    }
    if (currentStep === 2) {
      return 'Step 2 complete. Enter the third and final verification code to gain admin access.';
    }
    return 'All verification steps completed successfully.';
  };

  return (
    <div className="container flex min-h-screen items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Admin Access Verification</CardTitle>
          <CardDescription className="text-base font-medium">{getStepTitle()}</CardDescription>
          <CardDescription className="mt-2">{getStepDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-code">
                {currentStep === 0 && 'Code #1'}
                {currentStep === 1 && 'Code #2'}
                {currentStep === 2 && 'Code #3'}
              </Label>
              <Input
                id="admin-code"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter verification code"
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
              {isVerifying ? 'Verifying...' : currentStep === 2 ? 'Complete Verification' : 'Continue'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
