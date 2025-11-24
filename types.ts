export interface PercentageRow {
  percent: number;
  weight: number;
  label?: string; // e.g., "Warm up", "Working Set", "1RM"
}

export interface WodData {
  title: string;
  type: 'AMRAP' | 'EMOM' | 'FOR TIME' | 'STRENGTH' | 'OTHER';
  content: string; // The full text description
  date: string;
}

export enum AppTab {
  CALCULATOR = 'CALCULATOR',
  WOD = 'WOD',
  AI_COACH = 'AI_COACH'
}

export type DayOfWeek = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
];

export type WeeklyProgramming = Record<DayOfWeek, string>;
