// Gold rule with a centred diamond, as on the printed menus.
export function Ornament({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center gap-3 ${className}`}>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/60" />
      <span className="h-2 w-2 rotate-45 border border-gold/80" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/60" />
    </div>
  );
}
