export interface Metric {
  value: string;
  label: string;
}

export const metrics: Metric[] = [
  { value: "5", label: "production modules" },
  { value: "90%", label: "API latency reduction" },
  { value: "1,000+", label: "documents in semantic search" },
  { value: "~60%", label: "less manual infrastructure configuration" },
  { value: "~40%", label: "fewer production defects" },
  { value: "~20", label: "operations users" },
];
