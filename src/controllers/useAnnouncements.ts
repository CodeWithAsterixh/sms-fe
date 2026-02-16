import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { announcementService } from "../services/announcement.service";
import type { CreateAnnouncementDTO } from "../models/announcement.types";
import { QUERY_KEYS } from "../config/constants";

export const useAnnouncements = (studentId?: number | string) => {
  const queryClient = useQueryClient();

  const announcementsQuery = useQuery({
    queryKey: [QUERY_KEYS.ANNOUNCEMENTS, studentId],
    queryFn: () => announcementService.getByStudentId(studentId!),
    enabled: !!studentId,
  });

  const createAnnouncementMutation = useMutation({
    mutationFn: (data: CreateAnnouncementDTO) => announcementService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ANNOUNCEMENTS, variables.student_id] });
    },
  });

  return {
    announcements: announcementsQuery.data,
    isLoading: announcementsQuery.isLoading,
    error: announcementsQuery.error,
    createAnnouncement: createAnnouncementMutation.mutate,
    isCreating: createAnnouncementMutation.isPending,
  };
};
