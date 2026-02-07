import { useEffect, useRef } from 'react';

/**
 * Creates an object URL from bytes and tracks it for cleanup.
 * Returns the URL and a cleanup function.
 */
export function createManagedObjectUrl(bytes: Uint8Array, mimeType: string): {
  url: string;
  revoke: () => void;
} {
  const blob = new Blob([new Uint8Array(bytes)], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  return {
    url,
    revoke: () => URL.revokeObjectURL(url),
  };
}

/**
 * React hook that creates an object URL from bytes and automatically revokes it on unmount or when bytes change.
 * @param bytes - The byte array to convert to an object URL
 * @param mimeType - The MIME type of the content
 * @returns The object URL string
 */
export function useManagedObjectUrl(bytes: Uint8Array | null | undefined, mimeType: string): string | null {
  const urlRef = useRef<string | null>(null);
  const bytesRef = useRef<Uint8Array | null | undefined>(bytes);

  // Check if bytes have actually changed (by reference)
  const bytesChanged = bytesRef.current !== bytes;

  useEffect(() => {
    // Revoke previous URL if bytes changed
    if (bytesChanged && urlRef.current) {
      URL.revokeObjectURL(urlRef.current);
      urlRef.current = null;
    }

    // Create new URL if we have bytes
    if (bytes) {
      const blob = new Blob([new Uint8Array(bytes)], { type: mimeType });
      urlRef.current = URL.createObjectURL(blob);
      bytesRef.current = bytes;
    } else {
      urlRef.current = null;
      bytesRef.current = null;
    }

    // Cleanup on unmount
    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, [bytes, mimeType, bytesChanged]);

  return urlRef.current;
}

/**
 * React hook that creates object URLs for multiple items and manages cleanup.
 * @param items - Array of items with id and bytes
 * @param getBytesAndType - Function to extract bytes and MIME type from an item
 * @returns Map of item IDs to object URLs
 */
export function useManagedObjectUrls<T extends { id: string }>(
  items: T[],
  getBytesAndType: (item: T) => { bytes: Uint8Array; mimeType: string } | null
): Map<string, string> {
  const urlsRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const newUrls = new Map<string, string>();
    const currentIds = new Set(items.map((item) => item.id));

    // Create URLs for new items and reuse existing ones
    items.forEach((item) => {
      const existing = urlsRef.current.get(item.id);
      if (existing) {
        // Reuse existing URL
        newUrls.set(item.id, existing);
      } else {
        // Create new URL
        const data = getBytesAndType(item);
        if (data) {
          const blob = new Blob([new Uint8Array(data.bytes)], { type: data.mimeType });
          const url = URL.createObjectURL(blob);
          newUrls.set(item.id, url);
        }
      }
    });

    // Revoke URLs for items that are no longer in the list
    urlsRef.current.forEach((url, id) => {
      if (!currentIds.has(id)) {
        URL.revokeObjectURL(url);
      }
    });

    urlsRef.current = newUrls;

    // Cleanup all URLs on unmount
    return () => {
      urlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      urlsRef.current.clear();
    };
  }, [items, getBytesAndType]);

  return urlsRef.current;
}
