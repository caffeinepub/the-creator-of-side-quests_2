import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { ShieldCheck, AlertCircle } from 'lucide-react';
import { useRetryVerifyAdminSharedCode } from '../../hooks/admin/useAdminSharedCodeGate';
import { setAdminCodeVerified } from '../../utils/adminSharedCodeSession';

interface AdminSharedCodeGateScreenProps {
  onSuccess: () => void;
}

export default function AdminSharedCodeGateScreen({ onSuccess }: AdminSharedCodeGateScreenProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const verifyMutation = useRetryVerifyAdminSharedCode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!code.trim()) {
      setError('Please enter the admin shared code.');
      return;
    }

    try {
      const success = await verifyMutation.mutateAsync(code);
      if (success) {
        setAdminCodeVerified();
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    }
  };

  return (
    <div className="container flex min-h-screen items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Admin Access Verification</CardTitle>
          <CardDescription>
            Enter the shared admin code to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-code">Admin Shared Code</Label>
              <Input
                id="admin-code"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter shared code"
                disabled={verifyMutation.isPending}
                autoFocus
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={verifyMutation.isPending}
            >
              {verifyMutation.isPending ? 'Verifying...' : 'Verify Access'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
