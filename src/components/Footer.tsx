import { useTranslation } from '@/hooks/useTranslation';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-12 pt-8 pb-4 border-t border-gray-200">
      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t.builtWithLove}{' '}
          <a
            href="http://eslam.dev?ref=sharkny"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-primary/80 font-medium transition-colors duration-200 underline decoration-1 underline-offset-2 hover:decoration-2"
          >
            Eslam
          </a>
        </p>
      </div>
    </footer>
  );
}