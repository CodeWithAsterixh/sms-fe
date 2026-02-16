export type StudentStatus = "active" | "inactive" | "suspended";

export interface Student {
  id: number;
  student_uid: string;
  first_name: string;
  last_name: string;
  class_id: number;
  class_name?: string;
  today_status?: 'IN' | 'OUT' | null;
  photo_url?: string;
  status: StudentStatus;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateStudentDTO {
  first_name: string;
  last_name: string;
  class_id: number;
}

export interface FinancialRecord {
  id: number;
  student_id: number;
  session: string;
  term: string;
  status: 'paid' | 'unpaid' | 'partial';
  amount: number;
  payment_date?: string;
  recorded_by: number;
  recorded_at: string;
}

export interface DisciplinaryRecord {
  id: number;
  student_id: number;
  type: string;
  description: string;
  recorded_by: number;
  recorded_at: string;
}

export interface ClassHistory {
  id: number;
  student_id: number;
  class_id: number;
  class_name: string;
  academic_session: string;
  promoted_at: string;
}
