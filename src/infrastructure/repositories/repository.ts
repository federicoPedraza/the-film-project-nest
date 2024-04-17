import { Injectable, Logger } from "@nestjs/common";
import { FilterQuery, ICreateDocument, IRepository } from "../interfaces";
import { Model, UpdateQuery } from "mongoose";

@Injectable()
export abstract class Repository<T> implements IRepository<T> {
  protected readonly logger: Logger;

  constructor(private readonly model: Model<T>) {
    this.logger = new Logger(model.name);
  }

  async create(data: ICreateDocument<T>): Promise<T> {
    return await this.model.create(data.value || data);
  }

  async findAll(filter?: FilterQuery<T>): Promise<T[]> {
    const query = this.model.find(filter?.query);

    if (Boolean(filter?.populate)) query.populate(filter?.populate);
    if (Boolean(filter?.limit)) query.limit(filter?.limit);
    if (Boolean(filter?.skip)) query.skip(filter.skip);

    return await query.exec();
  }

  async findOne(filter: FilterQuery<T>): Promise<T> {
    const query = this.model.findOne(filter.query);

    if (Boolean(filter.populate)) query.populate(filter.populate);

    return await query.exec();
  }

  async update(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<T | null> {
    return this.model.findOneAndUpdate(filter.query, data, { new: true }).exec();
  }

  async updateAll(filter: FilterQuery<T>, data: UpdateQuery<T>): Promise<any> {
    return this.model.updateMany(filter.query, data);
  }

  async delete(filter: FilterQuery<T>): Promise<any> {
    return await this.model.deleteOne(filter.query);
  }

  async count(filter?: FilterQuery<T>): Promise<number> {
    return await this.model.countDocuments(filter.query);
  }
}
