interface ErrorHeaderProps {
  title: string;
  description: string;
  titleColor?: string;
  className?: string;
}

export function ErrorHeader({
  title,
  description,
  titleColor = 'text-destructive',
  className = ''
}: ErrorHeaderProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className={`text-xl font-bold ${titleColor}`}>{title}</h3>
      <p className="text-muted-foreground text-base">{description}</p>
    </div>
  );
}