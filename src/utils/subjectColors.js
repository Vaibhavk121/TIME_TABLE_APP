export const subjectColors = {
  // Core subjects
  "CNS": "#3b82f6", // Blue
  "BDA": "#10b981", // Green
  "IOT": "#f59e0b", // Amber
  "PARALLEL": "#8b5cf6", // Purple
  "OPEN ELECTIVE": "#06b6d4", // Cyan
  
  // Class 6-A subjects
  "CC": "#ef4444", // Red
  "JAVA": "#f97316", // Orange
  "ML": "#ec4899", // Pink
  "DevOps": "#14b8a6", // Teal
  "IKS": "#84cc16", // Lime
  "IIILP": "#6366f1", // Indigo
  
  // Common subjects
  "APTITUDE": "#f43f5e", // Rose
  "TECHNICAL": "#06b6d4", // Cyan
  "PROJECT PHASE 2": "#8b5cf6", // Purple
  "PROJECT PHASE 1": "#8b5cf6", // Purple
  "LAB TUTORIAL": "#10b981", // Green
  "MENTORING": "#f59e0b", // Amber
  "Tutorial": "#f59e0b", // Amber
  "Coding": "#ec4899", // Pink
  "English": "#3b82f6", // Blue
  "NSS/Yoga/PE": "#10b981", // Green
  "Remedial Class": "#f43f5e", // Rose
  
  // Breaks and meals
  "Tea Break ☕": "#64748b", // Slate
  "LUNCH 🍗": "#f97316", // Orange
  "Lunch🍗": "#f97316", // Orange
  
  // Default color for unknown subjects
  "DEFAULT": "#6b7280", // Gray
};

export const getSubjectColor = (subject) => {
  return subjectColors[subject] || subjectColors["DEFAULT"];
};

export const getSubjectLightColor = (subject) => {
  const baseColor = getSubjectColor(subject);
  // Convert hex to rgba with 0.1 opacity for light background
  return baseColor + "1a";
}; 