/** French GR trail marker — white over red, painted on a dark rock. */
export function TrailBlaze({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex flex-col gap-[3px] rounded-[4px] bg-[#23241f] p-[5px] ${className}`} aria-hidden="true">
      <span className="block h-[4px] w-[16px] rounded-[1px] bg-[#f6f3ec]" />
      <span className="block h-[4px] w-[16px] rounded-[1px] bg-[#d63a24]" />
    </span>
  );
}
