interface Props {
  index: string;
  label: string;
}

export default function SectionLabel({ index, label }: Props) {
  return (
    <div className="flex items-center gap-4 mb-16 md:mb-20">
      <span className="font-mono text-[10px] text-[#38bdf8] tracking-[0.3em]">{index}</span>
      <div className="h-px w-8 bg-[rgba(240,237,230,0.2)]" />
      <span className="font-mono text-[10px] text-[#6b6860] tracking-[0.25em] uppercase">{label}</span>
    </div>
  );
}
