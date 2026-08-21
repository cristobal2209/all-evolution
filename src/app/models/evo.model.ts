export interface FluidSpec {
  capacity: string;
  viscosity: string;
  apiSpec: string;
  oemPart?: string;
  notes?: string;
}

export type Rating = 'high' | 'medium' | 'low' | 'none';

export interface RecommendedOil {
  brand: string;
  product: string;
  viscosity: string;
  apiSpec: string;
  norms: string[];
  daily: Rating;
  trackDay: Rating;
  fullRacing: Rating;
  notes?: string;
}

export interface VariantSpecs {
  engineOil: FluidSpec;
  transmissionOil: FluidSpec;
  frontDiff: FluidSpec | null;
  rearDiff: FluidSpec;
  transferCase: FluidSpec;
  aycFluid?: FluidSpec;
  aycPipework?: FluidSpec;
  recommendedEngineOils: RecommendedOil[];
  recommendedTransOils: RecommendedOil[];
  recommendedDiffOils: RecommendedOil[];
  recommendedTransferOils: RecommendedOil[];
}

export interface EVOModel {
  id: number;
  name: string;
  generation: string;
  chassis: string;
  years: string;
  engine: string;
  power: string;
  variants: string[];
  specs: Record<string, VariantSpecs>;
}
