import { Types } from "mongoose";

export interface IUserDataEntity {
  _id: Types.ObjectId | string;
}

export interface IMongoDBEntity {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}
