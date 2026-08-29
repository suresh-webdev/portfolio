interface IconProps {
  className?: string;
}

export function IconMail({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

export function IconLinkedIn({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="7" y1="10.5" x2="7" y2="17" />
      <circle cx="7" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
      <path d="M11 17v-4.5a2 2 0 0 1 4 0V17" />
      <line x1="11" y1="10.5" x2="11" y2="17" />
    </svg>
  );
}

export function IconGithub({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.6 1.7 5.5 2 5.5 2a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.1 8.4c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V20" />
    </svg>
  );
}
