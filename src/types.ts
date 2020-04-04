import { QueryBuilder } from 'knex';

export type MaybeArray<T> = T | T[];

export interface FromDB {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export type WithId = {
  id: number;
};

/**
 * This will return a type that has all columns of the Model, without DB generated columns: id, created_at, updated_at
 */
export type DataOnly<T> = Omit<
  T,
  | 'setDbInstance'
  | 'queryBuilder'
  | 'tableName'
  | 'findOne'
  | 'findAll'
  | 'find'
  | 'findByIds'
  | 'update'
  | 'insert'
  | 'delete'
>;

/**
 * This will return a type that has all columns of the Model, including id, created_at, updated_at
 */
export type DataFromDB<T> = FromDB & DataOnly<T>;

export type DataWithId<T> = WithId & DataOnly<T>;

/**
 * Alias for returning type of update, insert
 */
export type PromiseArrayDataFromDB<T> = Promise<Array<DataFromDB<T>>>;

/**
 * Input object of where operator. {id: 1, name: 'John'} -> id = 1 AND name = 'John
 */
export type QueryInput<T> = Partial<DataFromDB<T>>;

/**
 * Knex query builder returning type, narrow down to this Model only
 */
export type QueryBuilderReturn<T> = QueryBuilder<QueryInput<T>, QueryInput<T>>;

/**
 * Useful for insert one/many records
 */
export type MaybeArrayDataInput<T> = MaybeArray<DataOnly<T>>;

/**
 * Useful for update one/many records
 */
export type MaybeArrayPartialDataInput<T> = MaybeArray<Partial<DataOnly<T>>>;
