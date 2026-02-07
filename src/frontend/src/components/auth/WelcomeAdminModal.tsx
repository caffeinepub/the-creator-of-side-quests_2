import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { ShieldCheck } from 'lucide-react';

interface WelcomeAdminModalProps {
  open: boolean;
  onContinue: () => void;
}

export default function WelcomeAdminModal({ open, onContinue }: WelcomeAdminModalProps) {
  return (
    <Dialog open={open} onOpenChange={onContinue}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Welcome to the Admin Dashboard
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            Enjoy your stay
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center pt-4">
          <Button onClick={onContinue} className="px-8">
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
