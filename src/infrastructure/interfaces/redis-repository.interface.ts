export interface IRedisRepository {
  set: (key: string, value: any, ttl?: number) => Promise<void>;
  get: (key: string) => Promise<any>;
  del: (key: string) => Promise<void>;
}
