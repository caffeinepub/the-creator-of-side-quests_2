import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../../components/ui/alert-dialog';
import { useListAdminUsers, useGrantAdminAccess, useRevokeAdminAccess } from '../../hooks/admin/useAdminAccess';
import { Principal } from '@dfinity/principal';
import { UserPlus, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminAccessPage() {
  const [principalInput, setPrincipalInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  const { data: adminUsers = [], isLoading } = useListAdminUsers();
  const grantMutation = useGrantAdminAccess();
  const revokeMutation = useRevokeAdminAccess();

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

  const handleRevokeAccess = async (principal: Principal) => {
    await revokeMutation.mutateAsync(principal);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Admin Access Management</h1>
        <p className="mt-2 text-muted-foreground">
          Grant or revoke admin access for users. Users must also enter the shared admin code to access the admin panel.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Grant Admin Access
          </CardTitle>
          <CardDescription>
            Enter a user's Principal ID to grant them admin access. They will also need the shared admin code.
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
            List of users with admin access. You can revoke access from this list.
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
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminUsers.map((principal) => (
                  <TableRow key={principal.toString()}>
                    <TableCell className="font-mono text-sm">
                      {principal.toString()}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={revokeMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Revoke Admin Access</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to revoke admin access for this user? They will no longer be able to access the admin panel.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRevokeAccess(principal)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Revoke Access
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
