import React from 'react';
import clsx from 'clsx';

export type TagProps = {
  children: React.ReactNode;
  className?: string;
  variant?: 'outline' | 'secondary';
};

export function Tag({ children, className, variant = 'outline' }: TagProps) {
  return (
    <span
      className={clsx(
        'inline-block rounded-full text-xs font-semibold px-3 py-1',
        variant === 'secondary'
          ? 'bg-blue-100 text-blue-800'
          : 'border border-gray-300 bg-white text-gray-700',
        className
      )}
    >
      {children}
    </span>
  );
} 