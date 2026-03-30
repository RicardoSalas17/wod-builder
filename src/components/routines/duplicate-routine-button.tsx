'use client';

import { useState } from 'react';

import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

type DuplicateRoutineButtonProps = {
  routineId: string;
  copy: {
    idle: string;
    loading: string;
    error: string;
  };
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
};

export function DuplicateRoutineButton({
  routineId,
  copy,
  variant = 'outline',
  size = 'sm',
}: DuplicateRoutineButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleDuplicate = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch(`/api/routines/${routineId}/duplicate`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('duplicate failed');
      }

      const data = await response.json();
      router.push(`/routines/${data.id}`);
      router.refresh();
    } catch {
      setMessage(copy.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        size={size}
        variant={variant}
        onClick={handleDuplicate}
        disabled={isLoading}
      >
        {isLoading ? copy.loading : copy.idle}
      </Button>
      <p className="sr-only" aria-live="polite">
        {message}
      </p>
      {message ? (
        <p className="text-sm leading-6 text-rose-300">{message}</p>
      ) : null}
    </>
  );
}
