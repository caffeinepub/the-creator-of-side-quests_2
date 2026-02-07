import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle, Key } from 'lucide-react';
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

    // Mark as verified to enable code input fields
    // Actual verification happens when saving
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
          Manage the three-step admin verification codes. The Master Override Code is required to rotate Codes #1, #2, and #3.
        </p>
      </div>

      {/* Master Override Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Master Override Verification
          </CardTitle>
          <CardDescription>
            Enter the Master Override Code to unlock code rotation. This code bypasses all three verification steps and is required to change Codes #1, #2, and #3.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="master-override">Master Override Code</Label>
            <Input
              id="master-override"
              type="password"
              value={masterOverrideCode}
              onChange={(e) => setMasterOverrideCode(e.target.value)}
              placeholder="Enter Master Override Code"
              disabled={isVerified}
            />
          </div>

          {!isVerified && (
            <Button onClick={handleVerifyMasterCode} className="w-full">
              <Key className="mr-2 h-4 w-4" />
              Verify Master Override Code
            </Button>
          )}

          {isVerified && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Master Override Code accepted. You can now update the verification codes below.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Code Rotation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Rotate Verification Codes
          </CardTitle>
          <CardDescription>
            Update the three verification codes used for admin access. After saving, all existing admin sessions will be cleared and users must re-verify with the new codes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-code-1">New Code #1</Label>
            <Input
              id="new-code-1"
              type="password"
              value={newCode1}
              onChange={(e) => setNewCode1(e.target.value)}
              placeholder="Enter new Code #1"
              disabled={!isVerified}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-code-2">New Code #2</Label>
            <Input
              id="new-code-2"
              type="password"
              value={newCode2}
              onChange={(e) => setNewCode2(e.target.value)}
              placeholder="Enter new Code #2"
              disabled={!isVerified}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-code-3">New Code #3</Label>
            <Input
              id="new-code-3"
              type="password"
              value={newCode3}
              onChange={(e) => setNewCode3(e.target.value)}
              placeholder="Enter new Code #3"
              disabled={!isVerified}
            />
          </div>

          {verificationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{verificationError}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleSaveCodes} 
            className="w-full" 
            disabled={!isVerified || rotateCodesMutation.isPending}
          >
            {rotateCodesMutation.isPending ? 'Saving...' : 'Save New Codes'}
          </Button>

          {rotateCodesMutation.isSuccess && (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Verification codes updated successfully. All admin sessions have been cleared.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
