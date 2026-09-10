export type DBEvent = {
  id: string;
  title: string;
  copy: string;
  month: string;
  day: string;
  time: string;
  place: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  user_id: string | null;
  user_email: string | null;
  created_at: string;
};
