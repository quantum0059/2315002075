export interface Service<Entity, Key = string> {
  getById(id: Key): Promise<Entity | null>;
  list(): Promise<Entity[]>;
}
