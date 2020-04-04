import Knex, { QueryBuilder, Transaction } from 'knex';
import {
  QueryBuilderReturn,
  DataFromDB,
  QueryInput,
  PromiseArrayDataFromDB,
  MaybeArrayDataInput,
  MaybeArrayPartialDataInput,
} from './types';

export const classFactory = (db: Knex) => {
  abstract class Base {
    private db = db;
    public abstract tableName = null;

    /**
     * This does not affect the "global" cached-by-node-module db object, since it only assign the Transaction object to the class instance
     */
    public setDbInstance(newDb: Knex | Transaction) {
      this.db = newDb;
      return this;
    }

    public queryBuilder(): QueryBuilder<QueryInput<this>, QueryInput<this>> {
      return this.db.from(this.tableName);
    }

    public findOne(objectOrId: number | QueryInput<this>): Promise<DataFromDB<this> | null> {
      let query = this.queryBuilder();
      if (typeof objectOrId === 'number') {
        query = query.where('id', objectOrId);
      } else {
        query = query.where(objectOrId);
      }
      return query.then((rs: any) => (rs.length ? rs[0] : null));
    }

    public findAll(): PromiseArrayDataFromDB<this> {
      return this.queryBuilder()
        .select('*')
        .then((rs: any) => rs);
    }

    public find(value: QueryInput<this>): PromiseArrayDataFromDB<this> {
      return this.queryBuilder()
        .where(value)
        .then((rs: any) => rs);
    }

    public findByIds(ids: number[]): PromiseArrayDataFromDB<this> {
      return this.queryBuilder()
        .where('id', 'IN', ids)
        .then((rs: any) => rs);
    }

    public update(value: MaybeArrayPartialDataInput<this>, where: QueryInput<this>): PromiseArrayDataFromDB<this>;
    public update(
      value: MaybeArrayPartialDataInput<this>,
      where: QueryInput<this>,
      isTransacting?: boolean,
    ): QueryBuilderReturn<this>;
    public update(value: MaybeArrayPartialDataInput<this>, where: QueryInput<this>, isTransacting?: boolean) {
      let query = this.queryBuilder()
        .where(where)
        .update(value as any) // this is stricter than Knex type
        .returning('*');

      if (isTransacting) return query;
      return query.then((rs: any) => rs);
    }

    public insert(data: MaybeArrayDataInput<this>): PromiseArrayDataFromDB<this>;
    public insert(data: MaybeArrayDataInput<this>, isTransacting?: boolean): QueryBuilderReturn<this>;
    public insert(data: MaybeArrayDataInput<this>, isTransacting?: boolean) {
      let query = this.queryBuilder()
        .insert(data as any) // this is stricter than Knex type
        .returning('*');
      if (isTransacting) return query;
      return query.then((rs: any) => rs);
    }

    public delete(where: QueryInput<this>): Promise<number>;
    public delete(where: QueryInput<this>, isTransacting?: boolean): QueryBuilderReturn<this>;
    public delete(where: QueryInput<this>, isTransacting?: boolean) {
      let query = this.queryBuilder()
        .where(where) // this is stricter than Knex type
        .del();
      if (isTransacting) return query;
      return query.then((rs: any) => rs);
    }
  }
  return Base;
};