import type { City } from "../../../entities/ecom/locality/City";
  
export interface ICityRepository {
  getAll():Promise<City[]>;
}