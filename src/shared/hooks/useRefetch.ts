import { useCallback, useEffect, useRef } from 'react';

interface UseRefetchOptions {
  delay?: number;
  onRefetch?: () => Promise<void>;
}

export function useRefetch({ delay = 0, onRefetch }: UseRefetchOptions) {
  const refetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const refetch = useCallback(async () => {
    if (refetchTimeoutRef.current) {
      clearTimeout(refetchTimeoutRef.current);
    }

    if (delay > 0) {
      refetchTimeoutRef.current = setTimeout(async () => {
        if (onRefetch) {
          try {
            await onRefetch();
          } catch (error) {
            console.error('Erro ao atualizar dados:', error);
          }
        }
      }, delay);
    } else if (onRefetch) {
      try {
        await onRefetch();
      } catch (error) {
        console.error('Erro ao atualizar dados:', error);
      }
    }
  }, [delay, onRefetch]);

  useEffect(() => {
    return () => {
      if (refetchTimeoutRef.current) {
        clearTimeout(refetchTimeoutRef.current);
      }
    };
  }, []);

  return { refetch };
}
