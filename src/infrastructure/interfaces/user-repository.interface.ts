import { IUser } from "src/domain/entities";
import { IRepository } from "./repository.interface";

export interface IUserRepository extends IRepository<IUser> {}
