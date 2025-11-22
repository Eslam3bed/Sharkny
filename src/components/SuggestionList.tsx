interface SuggestionListProps {
  suggestions: string[];
  title?: string;
  className?: string;
}

export function SuggestionList({
  suggestions,
  title = "💡 Try this:",
  className = ''
}: SuggestionListProps) {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className={`w-full max-w-sm mx-auto ${className}`}>
      <div className="text-sm font-medium text-gray-700 mb-3 text-center">
        {title}
      </div>
      <ul className="space-y-2 text-sm text-gray-600">
        {suggestions.map((suggestion, index) => (
          <li key={index} className="flex items-start gap-2 px-3 py-2 rounded-lg bg-white/50 border border-gray-100">
            <span className="text-gray-400 mt-0.5 text-xs">•</span>
            <span className="flex-1 leading-relaxed">{suggestion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}