import { Badge } from '@/components/ui/badge';

interface ShellPlaceholderProps {
  title: string;
  description: string;
}

export function ShellPlaceholder({
  title,
  description,
}: ShellPlaceholderProps) {
  return (
    <div className="flex items-center justify-center w-full h-full bg-background">
      <div className="text-center max-w-[400px] p-8">
        <h2 className="m-0 mb-2 text-2xl font-bold text-foreground">{title}</h2>
        <p className="m-0 mb-4 text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        <Badge
          variant="secondary"
          className="font-mono text-xs text-muted-foreground"
        >
          Coming Soon
        </Badge>
      </div>
    </div>
  );
}
