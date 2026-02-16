export const generateStudentUID = (): string => {
  // Simple UID generator for frontend simulation if needed
  // In a real app, this should probably come from the backend or follow a specific format
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `STU-${year}-${random}`;
};
