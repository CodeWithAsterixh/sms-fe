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
    FINANCIALS: (id: number | string) => `/students/${id}/financials`,
    DISCIPLINARY: (id: number | string) => `/students/${id}/disciplinary`,
    CLASS_HISTORY: (id: number | string) => `/students/${id}/class-history`,
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
  CONDUCT: {
    CREATE: "/conduct-records",
    BY_STUDENT: (studentId: number | string) => `/conduct-records/student/${studentId}`,
    UPDATE: (id: number | string) => `/conduct-records/${id}`,
    DELETE: (id: number | string) => `/conduct-records/${id}`,
  },
  FINANCIAL: {
    CREATE: "/financial-records",
    BY_STUDENT: (studentId: number | string) => `/financial-records/student/${studentId}`,
    UPDATE: (id: number | string) => `/financial-records/${id}`,
  },
};
