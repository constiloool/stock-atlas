export type AgentScore = {
  id: string;
  name: string;
  style: string;
  score: number;
  summary: string;
  factors: {
    label: string;
    value: number;
  }[];
  status: "placeholder" | "live";
};
