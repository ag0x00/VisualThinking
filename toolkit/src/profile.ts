export interface ProfileBinding {
  operator: string;
  weight: number;
  target: unknown;
}

export interface AestheticProfile {
  medium: string;
  operators: ProfileBinding[];
  calibration?: { references: string[]; notes: string };
}
