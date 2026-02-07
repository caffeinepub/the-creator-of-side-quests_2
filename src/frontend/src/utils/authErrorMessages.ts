/**
 * Maps common Internet Identity/AuthClient error cases to clear, user-facing messages.
 * No secrets or tokens are included in these messages.
 */

export function getAuthErrorMessage(error: unknown): string {
  if (!error) {
    return 'An unexpected error occurred during authentication.';
  }

  const errorMessage = error instanceof Error ? error.message : String(error);
  const lowerMessage = errorMessage.toLowerCase();

  // Popup blocked
  if (lowerMessage.includes('popup') && (lowerMessage.includes('block') || lowerMessage.includes('close'))) {
    return 'Login popup was blocked. Please allow popups for this site and try again.';
  }

  // User cancelled
  if (lowerMessage.includes('user') && lowerMessage.includes('cancel')) {
    return 'Login was cancelled. Click Login to try again.';
  }

  // Already authenticated
  if (lowerMessage.includes('already') && lowerMessage.includes('authenticated')) {
    return 'You are already logged in. If you need to switch accounts, please log out first.';
  }

  // Network/connection issues
  if (lowerMessage.includes('network') || lowerMessage.includes('connection') || lowerMessage.includes('closed')) {
    return 'Connection issue detected. Please check your internet connection and try again.';
  }

  // Initialization not ready
  if (lowerMessage.includes('not initialized') || lowerMessage.includes('not available')) {
    return 'Authentication system is still loading. Please wait a moment and try again.';
  }

  // Timeout
  if (lowerMessage.includes('timeout') || lowerMessage.includes('timed out')) {
    return 'Login request timed out. Please try again.';
  }

  // Generic fallback
  return 'Login failed. Please try again or contact support if the issue persists.';
}
