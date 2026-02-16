export type AttendanceType = "IN" | "OUT";

export interface Attendance {
  id: number;
  student_id: number;
  type: AttendanceType;
  recorded_by: number;
  recorded_at: string;
}

export interface CreateAttendanceDTO {
  student_id: number;
  type: AttendanceType;
  recorded_by: number;
}
