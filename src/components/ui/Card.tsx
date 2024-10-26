import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-md overflow-hidden",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("p-6 border-b border-gray-200", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: CardProps) {
  return (
    <h3
      className={cn("text-lg font-semibold text-gray-900", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: CardProps) {
  return (
    <div className={cn("p-6", className)} {...props} />
  );
}