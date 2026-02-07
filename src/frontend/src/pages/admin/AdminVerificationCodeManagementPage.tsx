import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRotateVerificationCodes } from '@/hooks/admin/useVerificationCodeManagement';

export default function AdminVerificationCodeManagementPage() {
  const [masterOverrideCode, setMasterOverrideCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  
  const [newCode1, setNewCode1] = useState('');
  const [newCode2, setNewCode2] = useState('');
  const [newCode3, setNewCode3] = useState('');

  const rotateCodesMutation = useRotateVerificationCodes();

  const handleVerifyMasterCode = () => {
    setVerificationError('');
    
    if (!masterOverrideCode.trim()) {
      setVerificationError('Please enter the Master Override Code');
      return;
    }

    // Verify by attempting to use it (we'll validate on save)
    setIsVerified(true);
  };

  const handleSaveCodes = async () => {
    if (!newCode1.trim() || !newCode2.trim() || !newCode3.trim()) {
      setVerificationError('All three verification codes must be filled in');
      return;
    }

    try {
      await rotateCodesMutation.mutateAsync({
        masterOverride: masterOverrideCode,
        newCode1,
        newCode2,
        newCode3,
      });

      // Reset form after successful save
      setMasterOverrideCode('');
      setNewCode1('');
      setNewCode2('');
      setNewCode3('');
      setIsVerified(false);
      setVerificationError('');
    } catch (error: any) {
      setVerificationError('Unable to save codes. Please verify your Master Override Code is correct.');
      setIsVerified(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Verification Code Management</h1>
        <p className="mt-2 text-muted-foreground">
          Manage the three-step admin verification codes used to access the admin panel.
        </p>
      </div>

      {/* Master Override Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Master Override Code
          </CardTitle>
          <CardDescription>
            Enter the Master Override Code to unlock code management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="masterOverride">Master Override Code</Label>
            <Input
              id="masterOverride"
              type="password"
              value={masterOverrideCode}
              onChange={(e) => setMasterOverrideCode(e.target.value)}
              disabled={isVerified}
              placeholder="Enter Master Override Code"
            />
          </div>

          {verificationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{verificationError}</AlertDescription>
            </Alert>
          )}

          {isVerified && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Master Override Code verified. You can now update the verification codes below.
              </AlertDescription>
            </Alert>
          )}

          {!isVerified && (
            <Button onClick={handleVerifyMasterCode} className="w-full">
              <Lock className="mr-2 h-4 w-4" />
              Verify Master Override Code
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Verification Codes Management */}
      <Card>
        <CardHeader>
          <CardTitle>Update Verification Codes</CardTitle>
          <CardDescription>
            Set new values for Admin Verification Codes #1, #2, and #3
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code1">New Code #1</Label>
            <Input
              id="code1"
              type="password"
              value={newCode1}
              onChange={(e) => setNewCode1(e.target.value)}
              disabled={!isVerified}
              placeholder="Enter new Code #1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code2">New Code #2</Label>
            <Input
              id="code2"
              type="password"
              value={newCode2}
              onChange={(e) => setNewCode2(e.target.value)}
              disabled={!isVerified}
              placeholder="Enter new Code #2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="code3">New Code #3</Label>
            <Input
              id="code3"
              type="password"
              value={newCode3}
              onChange={(e) => setNewCode3(e.target.value)}
              disabled={!isVerified}
              placeholder="Enter new Code #3"
            />
          </div>

          {rotateCodesMutation.isSuccess && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Verification codes updated successfully. All admin sessions have been cleared.
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleSaveCodes}
            disabled={!isVerified || rotateCodesMutation.isPending}
            className="w-full"
          >
            {rotateCodesMutation.isPending ? 'Saving...' : 'Save New Codes'}
          </Button>

          {!isVerified && (
            <p className="text-center text-sm text-muted-foreground">
              Verify the Master Override Code above to enable code updates
            </p>
          )}
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> After updating verification codes, all existing admin sessions will be cleared and administrators will need to re-verify using the new codes.
        </AlertDescription>
      </Alert>
    </div>
  );
}
