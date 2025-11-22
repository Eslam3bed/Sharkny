import { useTranslation } from '@/hooks/useTranslation';

interface TechnicalDetailsProps {
  error: string;
  className?: string;
}

export function TechnicalDetails({ error, className = '' }: TechnicalDetailsProps) {
  const { t } = useTranslation();

  // Clean up the error message to remove redundant prefixes
  const cleanError = error
    .replace(/^❌\s+/, '') // Remove ❌ prefix
    .replace(/^\s*Error:\s*/i, '') // Remove Error: prefix
    .trim();

  return (
    <details className={`w-full max-w-md mx-auto ${className}`}>
      <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors text-center">
        {t.showTechnicalDetails}
      </summary>
      <div className="mt-2 p-3 bg-muted rounded-lg">
        <code className="text-xs text-muted-foreground wrap-break-word block text-left">
          {cleanError}
        </code>
      </div>
    </details>
  );
}