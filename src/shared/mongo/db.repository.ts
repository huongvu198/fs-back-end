type BaseQuery<T> = {
  [P in keyof T]?: any;
};

export abstract class DBRepository<T> {
  abstract insert(entity: Partial<T>): Promise<T>;

  abstract exists(filter: BaseQuery<T>): Promise<boolean>;

  abstract find(filter: BaseQuery<T>): Promise<T[]>;

  abstract findOne(filter: BaseQuery<T>): Promise<T>;

  abstract updateOne(filter: BaseQuery<T>, update: BaseQuery<T>): Promise<T>;

  abstract softDeleteOne(filter: BaseQuery<T>): Promise<void>;
}
