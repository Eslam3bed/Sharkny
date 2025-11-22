import { useEffect, useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Loader2, Sparkles, Coffee, Zap } from 'lucide-react';

interface FunnyProgressProps {
  isProcessing: boolean;
}

export function FunnyProgress({ isProcessing }: FunnyProgressProps) {
  const { t } = useTranslation();
  const [messageIndex, setMessageIndex] = useState(0);
  const [showSparks, setShowSparks] = useState(false);

  const messages = [
    t.progress.processing,
    t.progress.serverSleeping,
    t.progress.extracting,
    t.progress.takingLonger,
    t.progress.analyzing,
    t.progress.almostDone,
    t.progress.finishing,
  ];

  useEffect(() => {
    if (!isProcessing) {
      setMessageIndex(0);
      setShowSparks(false);
      return;
    }

    const interval = setInterval(() => {
      setMessageIndex(prev => {
        const next = (prev + 1) % messages.length;
        // Show sparks when we reach "finishing" message
        if (next === messages.length - 1) {
          setShowSparks(true);
        }
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isProcessing, messages.length]);

  if (!isProcessing) return null;

  return (
    <div className="relative w-full max-w-md mx-auto px-4">
      {/* Background Container */}
      <div className="
        relative bg-card border border-border rounded-2xl p-6 sm:p-8 
        motion-preset-bounce motion-duration-1000
        overflow-hidden
      ">
        {/* Sparks Animation - shown when almost done */}
        {showSparks && (
          <div className="absolute inset-0 pointer-events-none">
            <Sparkles
              className="
                absolute top-4 right-4 h-6 w-6 text-yellow-400
                motion-preset-bounce motion-delay-100
              "
            />
            <Sparkles
              className="
                absolute bottom-4 left-4 h-5 w-5 text-blue-400
                motion-preset-bounce motion-delay-300
              "
            />
            <Sparkles
              className="
                absolute top-1/2 right-1/3 h-4 w-4 text-pink-400
                motion-preset-bounce motion-delay-500
              "
            />
          </div>
        )}

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center space-y-6">
          {/* Animated Icons */}
          <div className="relative">
            {/* Primary spinning loader */}
            <Loader2
              className="
                h-12 w-12 text-primary animate-spin
                motion-preset-spin motion-duration-2000
              "
            />

            {/* Floating coffee icon (appears during "server sleeping" message) */}
            {messageIndex === 1 && (
              <Coffee
                className="
                  absolute -top-8 -right-8 h-6 w-6 text-amber-600
                  motion-preset-float motion-duration-3000
                "
              />
            )}

            {/* Zap icon for energy (appears during "taking longer") */}
            {messageIndex === 3 && (
              <Zap
                className="
                  absolute -bottom-8 -left-8 h-6 w-6 text-yellow-500
                  motion-preset-shake motion-duration-500 motion-delay-200
                "
              />
            )}
          </div>

          {/* Progress Message */}
          <div className="text-center space-y-2">
            <p
              key={messageIndex}
              className="
                text-lg font-medium text-foreground
                motion-preset-fade motion-duration-500
              "
            >
              {messages[messageIndex]}
            </p>

            {/* Secondary encouraging text */}
            <p className="text-sm text-muted-foreground">
              {messageIndex < 3 ? t.pleaseWait : t.progress.almostDone}
            </p>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="
                h-full bg-linear-to-r from-primary via-purple-500 to-pink-500
                motion-preset-slide-right motion-duration-2000
                animate-pulse
              "
              style={{
                width: `${Math.min(((messageIndex + 1) / messages.length) * 100, 95)}%`,
                transition: 'width 3s ease-out'
              }}
            />
          </div>

          {/* Bouncing Dots */}
          <div className="flex space-x-1">
            {[0, 1, 2].map((dot) => (
              <div
                key={dot}
                className="
                  w-2 h-2 bg-primary rounded-full
                  motion-preset-bounce motion-duration-1000
                "
                style={{
                  animationDelay: `${dot * 200}ms`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Background Animation Elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="
              absolute top-0 left-0 w-32 h-32 bg-primary rounded-full
              motion-preset-float motion-duration-6000
            "
            style={{ transform: 'translate(-50%, -50%)' }}
          />
          <div
            className="
              absolute bottom-0 right-0 w-24 h-24 bg-secondary rounded-full
              motion-preset-float motion-duration-4000 motion-delay-1000
            "
            style={{ transform: 'translate(50%, 50%)' }}
          />
        </div>
      </div>
    </div>
  );
}