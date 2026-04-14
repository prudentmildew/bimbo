/**
 * Minimal class-name joining stub — replaces clsx + tailwind-merge.
 * Kept until all components are migrated off Tailwind (issues #26-#29),
 * then deleted.
 */
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}
