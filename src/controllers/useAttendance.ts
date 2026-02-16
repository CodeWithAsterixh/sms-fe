import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceService } from "../services/attendance.service";
import type { CreateAttendanceDTO } from "../models/attendance.types";
import { QUERY_KEYS } from "../config/constants";

export const useAttendance = (studentId?: number | string) => {
  const queryClient = useQueryClient();

  const attendanceQuery = useQuery({
    queryKey: [QUERY_KEYS.ATTENDANCE, studentId],
    queryFn: () => attendanceService.getByStudentId(studentId!),
    enabled: !!studentId,
  });

  const recordAttendanceMutation = useMutation({
    mutationFn: (data: CreateAttendanceDTO) => attendanceService.record(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ATTENDANCE, variables.student_id] });
    },
  });

  return {
    attendance: attendanceQuery.data,
    isLoading: attendanceQuery.isLoading,
    error: attendanceQuery.error,
    recordAttendance: recordAttendanceMutation.mutate,
    isRecording: recordAttendanceMutation.isPending,
  };
};
