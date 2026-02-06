import { useFulfillmentOptions } from '../../hooks/policies/usePolicies';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { MapPin } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FulfillmentNoticeProps {
  className?: string;
}

export default function FulfillmentNotice({ className }: FulfillmentNoticeProps) {
  const { data: options } = useFulfillmentOptions();

  if (!options) return null;

  return (
    <Alert className={cn(className)}>
      <MapPin className="h-4 w-4" />
      <AlertTitle>Local Service Area</AlertTitle>
      <AlertDescription>
        {!options.shippingEnabled && (
          <p className="mb-2">
            <strong>Shipping is not currently available.</strong> Items require local pickup or
            dropoff coordination in the Ashland/Westwood area of Kentucky.
          </p>
        )}
        <p>
          Available fulfillment:{' '}
          {[
            options.pickup && 'Pickup',
            options.dropoff && 'Dropoff',
            options.delivery && 'Delivery',
            options.shippingEnabled && 'Shipping',
          ]
            .filter(Boolean)
            .join(', ')}
        </p>
      </AlertDescription>
    </Alert>
  );
}
