import { Alert } from '@/components/ui/alert';
import { AlertTriangle, Wifi, Upload, Clock, ImageOff } from 'lucide-react';
import { IconWithBackground } from '@/components/IconWithBackground';
import { ErrorHeader } from '@/components/ErrorHeader';
import { SuggestionList } from '@/components/SuggestionList';
import { TechnicalDetails } from '@/components/TechnicalDetails';
import { ActionButtons } from '@/components/ActionButtons';
import { useTranslation } from '@/hooks/useTranslation';
import type { Translation } from '@/lib/translations';

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
  onClear?: () => void;
  showUploadButton?: boolean;
  onUpload?: () => void;
}

type ErrorType = 'network' | 'file' | 'processing' | 'validation' | 'rate-limit' | 'general';

function getErrorType(error: string): ErrorType {
  const lowerError = error.toLowerCase();

  if (lowerError.includes('network') || lowerError.includes('fetch') || lowerError.includes('connection')) {
    return 'network';
  }
  if (lowerError.includes('file') || lowerError.includes('image') || lowerError.includes('upload')) {
    return 'file';
  }
  if (lowerError.includes('processing') || lowerError.includes('ai') || lowerError.includes('extract')) {
    return 'processing';
  }
  if (lowerError.includes('not_a_bill') || lowerError.includes('validation') ||
    lowerError.includes('does not appear to be a bill') ||
    lowerError.includes('not a receipt') ||
    lowerError.includes('bill or receipt')) {
    return 'validation';
  }
  if (lowerError.includes('rate') || lowerError.includes('limit') || lowerError.includes('quota')) {
    return 'rate-limit';
  }
  return 'general';
}

function getErrorInfo(errorType: ErrorType, t: Translation) {
  switch (errorType) {
    case 'network':
      return {
        icon: Wifi,
        title: t.errors.network.title,
        description: t.errors.network.description,
        suggestions: t.errors.network.suggestions,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };

    case 'file':
      return {
        icon: ImageOff,
        title: t.errors.file.title,
        description: t.errors.file.description,
        suggestions: t.errors.file.suggestions,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      };

    case 'processing':
      return {
        icon: AlertTriangle,
        title: t.errors.processing.title,
        description: t.errors.processing.description,
        suggestions: t.errors.processing.suggestions,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      };

    case 'validation':
      return {
        icon: Upload,
        title: t.errors.validation.title,
        description: t.errors.validation.description,
        suggestions: t.errors.validation.suggestions,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
      };

    case 'rate-limit':
      return {
        icon: Clock,
        title: t.errors.rateLimit.title,
        description: t.errors.rateLimit.description,
        suggestions: t.errors.rateLimit.suggestions,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200'
      };

    default:
      return {
        icon: AlertTriangle,
        title: t.errors.general.title,
        description: t.errors.general.description,
        suggestions: t.errors.general.suggestions,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200'
      };
  }
}

export function ErrorDisplay({ error, onRetry, onClear, showUploadButton = false, onUpload }: ErrorDisplayProps) {
  const { t } = useTranslation();
  const errorType = getErrorType(error);
  const errorInfo = getErrorInfo(errorType, t);
  const IconComponent = errorInfo.icon;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-0">
      <Alert className={`${errorInfo.bgColor} ${errorInfo.borderColor} border-2 shadow-lg rounded-xl`}>
        <div className="flex flex-col items-center text-center space-y-4 py-4 sm:py-6">
          <IconWithBackground
            icon={IconComponent}
            size="lg"
            color={errorInfo.color}
            bgColor={errorInfo.bgColor}
          />

          <ErrorHeader
            title={errorInfo.title}
            description={errorInfo.description}
            titleColor={errorInfo.color}
          />

          <SuggestionList
            suggestions={errorInfo.suggestions}
            title="💡 Try this:"
            className="w-full max-w-md"
          />

          <TechnicalDetails error={error} />
        </div>
      </Alert>

      <ActionButtons
        onRetry={onRetry}
        onClear={onClear}
        showUploadButton={showUploadButton}
        onUpload={onUpload}
      />
    </div>
  );
}