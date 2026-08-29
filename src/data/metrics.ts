export interface Metric {
  value: string;
  label: string;
  /** How the number was achieved. A bare figure reads as a claim; the
   *  mechanism next to it reads as engineering. */
  detail: string;
}

export const metrics: Metric[] = [
  {
    value: "5",
    label: "production modules",
    detail: "API contract, data model, backend and interface owned per module",
  },
  {
    value: "90%",
    label: "API latency reduction",
    detail: "Query optimisation, indexing and caching, profiled under load",
  },
  {
    value: "1,000+",
    label: "documents in semantic search",
    detail: "Vector similarity ranking served from Qdrant",
  },
  {
    value: "~60%",
    label: "less manual infrastructure config",
    detail: "EKS and VPC provisioning codified in Terraform",
  },
  {
    value: "~40%",
    label: "fewer production defects",
    detail: "Unit and integration coverage with Vitest",
  },
  {
    value: "~20",
    label: "operations users",
    detail: "Internal ad-auditing tool, since wound down",
  },
];
