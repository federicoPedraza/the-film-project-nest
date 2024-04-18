import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude } from "class-transformer";
import { Document } from "mongoose";
import { IMongoDBEntity } from "./entity.base";

export interface IUser extends IMongoDBEntity {
  email: string;
  password?: string;
  status: EUserStatus;
  role: EUserRole;
}

export enum EUserStatus {
  ACTIVE = "active",
  DELETED = "deleted",
  BLOCKED = "blocked",
}

export enum EUserRole {
  ADMINISTRATOR = "administrator",
  REGULAR = "regular",
}

@Schema({ versionKey: false, timestamps: true })
export class User extends Document implements IUser {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  @Exclude()
  password: string;

  @Prop({
    type: String,
    enum: EUserStatus,
    default: EUserStatus.ACTIVE,
    required: true,
  })
  status: EUserStatus;

  @Prop({
    type: String,
    enum: EUserRole,
    default: EUserRole.REGULAR,
    required: true,
  })
  role: EUserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
