export interface Exam {
  id: string;
  examName: string;
  count: number;
  shifts: number;
  labs?: string[];
  timing?: 'forenoon' | 'afternoon' | 'full day';
  description?: string;
  date: Date;
  createdBy: string;
  deleted?: boolean;
}
