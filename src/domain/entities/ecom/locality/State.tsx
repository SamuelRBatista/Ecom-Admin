import type { City } from './City';

export interface State {
  id: number;
  name: string;
  uf: string;
  cities?: City[]; 
}