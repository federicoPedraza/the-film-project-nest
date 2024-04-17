import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/domain/entities";
import { Repository } from "./repository";
import { Entity } from "src/application/enums";

export class UserRepository extends Repository<User> {
  constructor(@InjectModel(Entity.User) private readonly userModel: Model<User>) {
    super(userModel);
  }
}
