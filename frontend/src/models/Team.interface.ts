import { User } from "./User.interface";

export interface ITeam {
  teamId?: number,
  name?: string,
  description?: string,
  members?: User[],
  creator?: string,
  created?: Date,
}
