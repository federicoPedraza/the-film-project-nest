import { Inject, Injectable, Logger } from "@nestjs/common";
import { IRedisRepository } from "../interfaces";
import { Redis } from "ioredis";

@Injectable()
export class RedisRepository implements IRedisRepository {
  private readonly logger: Logger = new Logger(RedisRepository.name);

  constructor(@Inject("REDIS") private readonly client: Redis) {}

  async set(key: string, value: any): Promise<void> {
    await this.client.set(key, value);
  }

  async get(key: string): Promise<any> {
    const data = await this.client.get(key);

    return data ? JSON.parse(await this.client.get(key)) : null;
  }

  async del(key: string): Promise<void> {
    this.client.del(key);
  }
}
