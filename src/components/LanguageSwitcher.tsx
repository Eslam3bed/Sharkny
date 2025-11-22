import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';
import { Languages } from 'lucide-react';
import type { Language } from '@/lib/i18n';

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage: Language = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
  };

  const currentFlag = language === 'ar' ? '🇯🇴' : '🇺🇸';
  const currentLabel = language === 'ar' ? 'العربية' : 'English';

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 min-w-0 px-3"
      title={t.switchLanguage}
    >
      <Languages className="h-4 w-4 shrink-0" />
      <span className="text-sm font-medium hidden sm:inline">
        {currentFlag} {currentLabel}
      </span>
      <span className="text-lg sm:hidden" role="img" aria-label={currentLabel}>
        {currentFlag}
      </span>
    </Button>
  );
}