export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
  },
  STUDENTS: {
    LIST: "/students",
    DETAIL: (id: number | string) => `/students/${id}`,
    CREATE: "/students",
  },
  USERS: {
    LIST: "/users",
    DETAIL: (id: number | string) => `/users/${id}`,
    CREATE: "/users",
  },
  CLASSES: {
    LIST: "/classes",
    CREATE: "/classes",
  },
  ATTENDANCE: {
    RECORD: "/attendance",
    BY_STUDENT: (studentId: number | string) => `/attendance/student/${studentId}`,
  },
  ANNOUNCEMENTS: {
    CREATE: "/announcements",
    BY_STUDENT: (studentId: number | string) => `/announcements/student/${studentId}`,
  },
};
