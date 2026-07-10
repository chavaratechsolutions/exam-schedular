export interface Exam {
  id: string;
  examName: string;
  count: number;
  shifts: number;
  labs?: string[];
  description?: string;
  date: Date;
  createdBy: string;
  deleted?: boolean;
}
