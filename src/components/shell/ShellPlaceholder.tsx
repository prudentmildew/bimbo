interface ShellPlaceholderProps {
  title: string;
  description: string;
}

export function ShellPlaceholder({
  title,
  description,
}: ShellPlaceholderProps) {
  return (
    <div className="shell-placeholder">
      <div className="shell-placeholder-inner">
        <h2 className="shell-placeholder-title">{title}</h2>
        <p className="shell-placeholder-desc">{description}</p>
        <span className="shell-placeholder-badge mono-label">Coming Soon</span>
      </div>
    </div>
  );
}
