import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { clearAdminVerificationProgress } from '../../utils/adminSharedCodeSession';
import { getAuthErrorMessage } from '../../utils/authErrorMessages';
import { toast } from 'sonner';
import { useEffect } from 'react';

export default function LoginButton() {
  const { login, clear, loginStatus, identity, loginError } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const text = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  // Show error toast when login fails
  useEffect(() => {
    if (loginError) {
      const userMessage = getAuthErrorMessage(loginError);
      toast.error('Login Failed', {
        description: userMessage,
      });
    }
  }, [loginError]);

  const handleAuth = async () => {
    if (isAuthenticated) {
      try {
        await clear();
        queryClient.clear();
        clearAdminVerificationProgress();
      } catch (error) {
        const userMessage = getAuthErrorMessage(error);
        toast.error('Logout Failed', {
          description: userMessage,
        });
      }
    } else {
      try {
        login();
      } catch (error) {
        const userMessage = getAuthErrorMessage(error);
        toast.error('Login Failed', {
          description: userMessage,
        });
      }
    }
  };

  return (
    <Button
      onClick={handleAuth}
      disabled={disabled}
      variant={isAuthenticated ? 'outline' : 'default'}
      size="sm"
    >
      {text}
    </Button>
  );
}
