import type { ChainScope } from "@/types";
import { CHAIN_NAMES, SUPPORTED_CHAINS } from "@/types";
import { cn } from "@/lib/utils";

const OPTIONS: { value: ChainScope; label: string }[] = [
  { value: "all", label: "All chains" },
  ...SUPPORTED_CHAINS.map((id) => ({
    value: id as ChainScope,
    label: CHAIN_NAMES[id],
  })),
];

export function ChainSelect({
  value,
  onChange,
  disabled,
  className,
}: {
  value: ChainScope;
  onChange: (value: ChainScope) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <select
      value={value === "all" ? "all" : String(value)}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === "all" ? "all" : (Number(v) as ChainScope));
      }}
      disabled={disabled}
      className={cn(
        "h-12 rounded-lg border border-line bg-surface px-3 text-sm text-foreground outline-none focus:border-brand disabled:opacity-60",
        className,
      )}
    >
      {OPTIONS.map((opt) => (
        <option key={String(opt.value)} value={String(opt.value)}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
