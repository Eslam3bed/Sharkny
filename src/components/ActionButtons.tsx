import { Button } from '@/components/ui/button';
import { RefreshCw, Upload, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface ActionButtonsProps {
  onRetry: () => void;
  onClear?: () => void;
  showUploadButton?: boolean;
  onUpload?: () => void;
  className?: string;
}

export function ActionButtons({
  onRetry,
  onClear,
  showUploadButton = false,
  onUpload,
  className = ''
}: ActionButtonsProps) {
  const { t } = useTranslation();

  return (
    <div className={`flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6 ${className}`}>
      <Button
        onClick={onRetry}
        variant="default"
        size="lg"
        className="gap-2 touch-target"
      >
        <RefreshCw className="h-4 w-4" />
        {t.tryAgain}
      </Button>

      {showUploadButton && onUpload && (
        <Button
          onClick={onUpload}
          variant="outline"
          size="lg"
          className="gap-2 touch-target"
        >
          <Upload className="h-4 w-4" />
          {t.uploadReceipt}
        </Button>
      )}

      {onClear && (
        <Button
          onClick={onClear}
          variant="outline"
          size="lg"
          className="gap-2 touch-target"
        >
          <X className="h-4 w-4" />
          {t.startOver}
        </Button>
      )}
    </div>
  );
}