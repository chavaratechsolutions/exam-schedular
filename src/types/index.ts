export interface Exam {
  id: string;
  examName: string;
  count: number;
  shifts: number;
  description?: string;
  date: Date;
  createdBy: string;
}
