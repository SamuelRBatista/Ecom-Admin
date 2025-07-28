import type { State } from "../../../entities/ecom/locality/State";

export interface IStateRepository {
  getAll():Promise<State[]>;
}