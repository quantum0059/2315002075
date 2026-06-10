export interface Repository<T, Key = string> {
  findById(id: Key): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  remove(id: Key): Promise<void>;
}
