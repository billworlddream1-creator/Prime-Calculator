
export interface Theme {
  name: string;
  bg: string;
  card: string;
  accent: string;
  secondary: string;
}

export interface CalculationEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}
