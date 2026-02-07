import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { useListAdminUsers, useGrantAdminAccess } from '../../hooks/admin/useAdminAccess';
import { Principal } from '@dfinity/principal';
import { UserPlus, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminAccessPage() {
  const [principalInput, setPrincipalInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  const { data: adminUsers = [], isLoading } = useListAdminUsers();
  const grantMutation = useGrantAdminAccess();

  const handleGrantAccess = async () => {
    setInputError(null);

    if (!principalInput.trim()) {
      setInputError('Please enter a principal ID');
      return;
    }

    try {
      const principal = Principal.fromText(principalInput.trim());
      await grantMutation.mutateAsync(principal);
      setPrincipalInput('');
    } catch (error: any) {
      setInputError(error.message || 'Invalid principal ID format');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Admin Access Management</h1>
        <p className="mt-2 text-muted-foreground">
          Grant user access. Users must also complete the separate three-step verification process to access the admin panel.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Grant User Access
          </CardTitle>
          <CardDescription>
            Enter a user's Principal ID to grant them access. They will also need to complete the separate admin verification process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="principal-input">User Principal ID</Label>
              <div className="flex gap-2">
                <Input
                  id="principal-input"
                  value={principalInput}
                  onChange={(e) => {
                    setPrincipalInput(e.target.value);
                    setInputError(null);
                  }}
                  placeholder="e.g., aaaaa-aa..."
                  disabled={grantMutation.isPending}
                  className="font-mono text-sm"
                />
                <Button
                  onClick={handleGrantAccess}
                  disabled={grantMutation.isPending || !principalInput.trim()}
                >
                  {grantMutation.isPending ? 'Granting...' : 'Grant Access'}
                </Button>
              </div>
            </div>

            {inputError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{inputError}</AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Current Admin Users
          </CardTitle>
          <CardDescription>
            List of users with admin access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading admin users...</p>
          ) : adminUsers.length === 0 ? (
            <Alert>
              <AlertDescription>No admin users found.</AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Principal ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminUsers.map((principal) => (
                  <TableRow key={principal.toString()}>
                    <TableCell className="font-mono text-sm">
                      {principal.toString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
