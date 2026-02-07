import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { XCircle } from 'lucide-react';

interface AdminLockoutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminLockoutModal({ open, onClose }: AdminLockoutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="h-5 w-5" />
            Admin Access Permanently Locked
          </DialogTitle>
          <DialogDescription className="text-base">
            You have exceeded the maximum number of failed verification attempts. Your admin access has been permanently revoked for this account.
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4 flex justify-center">
          <img
            src="/assets/generated/admin-lockout-popup.dim_1024x1536.png"
            alt="Admin access locked"
            className="max-h-96 w-auto rounded-lg shadow-lg"
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
