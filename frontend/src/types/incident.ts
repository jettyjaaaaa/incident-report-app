export type Incident = {
  id: string;
  title: string;
  description: string;
  category: "safety" | "maintenance";
  status: "open" | "in_progress" | "success";
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
};
