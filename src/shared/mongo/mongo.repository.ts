/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ConflictException, NotFoundException } from '@nestjs/common';
import { isDefined } from 'class-validator';
import { get, set } from 'express-http-context';
import mongoose, {
  Condition,
  DeleteResult,
  Document,
  Model,
  PipelineStage,
  QueryOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';

import { DBRepository } from './db.repository';
import { DeleteOptions, UpdateOptions } from './mongoose';

const MONGODB_SESSION = 'mongodb-session';

type Query<T extends Document> = {
  [P in keyof T]?: Condition<T[P]>;
} & {
  [key: string]: any;
};

type SoftDeleteQuery<T extends Document> = Query<T> & {
  deleted?: boolean;
};

export function toObjectId(stringId: string) {
  return new mongoose.Types.ObjectId(stringId);
}

export class MongoRepository<T extends Document> extends DBRepository<T> {
  constructor(
    protected readonly model: SoftDeleteModel<T> | Model<T>,
    protected readonly connection?: mongoose.Connection,
  ) {
    super();
  }

  async insert(doc: Partial<T>): Promise<T> {
    return this.model
      .create([doc], { session: this.getSession() })
      .then((docs) => (docs.length > 0 ? docs[0].toObject() : null));
  }

  async insertMany(doc: Partial<T>[]): Promise<T[]> {
    return this.model
      .create(doc, { session: this.getSession() })
      .then((docs: T[]) =>
        docs.length > 0 ? docs.map((e) => e.toObject()) : null,
      );
  }

  async insertIfOnly(
    filter: Query<T>,
    doc: Partial<T>,
    error: any,
  ): Promise<T> {
    if (await this.exists(filter)) throw new ConflictException(error);
    return this.insert(doc);
  }

  async exists(filter: Query<T>): Promise<boolean> {
    return isDefined(
      await this.model.exists(filter).session(this.getSession()),
    );
  }

  async deleteAll(options?: DeleteOptions): Promise<number> {
    const result: DeleteResult = await this.model.deleteMany({}, options);
    return result.deletedCount;
  }

  async find(filter: Query<T>, options?: QueryOptions<T>): Promise<T[]> {
    return this.model
      .find(filter, {}, options)
      .session(this.getSession())
      .then((docs) => docs.map((doc) => doc.toObject()));
  }

  async findDeleted(filter: Query<T>): Promise<T[]> {
    return (this.model as SoftDeleteModel<T>)
      .findDeleted(filter)
      .session(this.getSession());
  }

  async deleteMany(filter: Query<T>, options?: DeleteOptions): Promise<number> {
    const result: DeleteResult = await this.model
      .deleteMany(filter, options)
      .session(this.getSession());

    return result.deletedCount;
  }

  async findOne(filter: Query<T>): Promise<T> {
    return this.model
      .findOne(filter)
      .session(this.getSession())
      .then((doc) => doc?.toObject());
  }

  async findOneOrError(filter: Query<T>, error: any): Promise<T> {
    const el = await this.findOne(filter);
    if (!el) throw new NotFoundException(error);
    return el;
  }

  async updateOne(
    filter: Query<T>,
    update: UpdateQuery<T> | UpdateWithAggregationPipeline,
    options?: QueryOptions<T>,
  ): Promise<T> {
    return this.model
      .findOneAndUpdate(filter, update, { ...options, new: true })
      .session(this.getSession())
      .then((doc) => doc?.toObject());
  }

  async updateMany(
    filter: Query<T>,
    update: UpdateQuery<T> | UpdateWithAggregationPipeline,
    options?: QueryOptions<T>,
  ) {
    return this.model
      .updateMany(filter, update, options as UpdateOptions)
      .then((doc) => doc.modifiedCount);
  }

  async updateOneDeleted(
    filter: Query<T>,
    update: UpdateQuery<T> | UpdateWithAggregationPipeline,
    options?: QueryOptions<T>,
  ): Promise<T> {
    return (this.model as SoftDeleteModel<T>)
      .findOneAndUpdateDeleted(filter, update, options)
      .session(this.getSession());
  }

  async softDeleteOne(filter: SoftDeleteQuery<T>): Promise<void> {
    await (this.model as SoftDeleteModel<T>)
      .delete(filter)
      .session(this.getSession());
  }

  async deleteOne(filter: Query<T>): Promise<void> {
    await this.model.deleteOne(filter).session(this.getSession());
  }

  async deleteOneOrError(filter: Query<T>, error: any): Promise<T> {
    if (!(await this.exists(filter))) throw new NotFoundException(error);
    return this.model.findOneAndDelete(filter).session(this.getSession());
  }

  async count(filter: Query<T>): Promise<number> {
    return this.model.countDocuments(filter).session(this.getSession());
  }

  async findWithPagination(
    filter: Query<T>,
    queryOptions: QueryOptions,
  ): Promise<T[]> {
    return this.model
      .find(filter, {}, queryOptions)
      .session(this.getSession())
      .then((docs) => docs.map((doc) => doc.toObject()));
  }

  async aggregate(pipeline: PipelineStage[]): Promise<any[]> {
    return this.model.aggregate(pipeline).session(this.getSession());
  }

  storeSession(_session: mongoose.ClientSession): void {
    set(MONGODB_SESSION, _session);
  }

  getSession(): mongoose.ClientSession | undefined {
    return get(MONGODB_SESSION);
  }

  async withTransaction<T>(fn: () => Promise<T>): Promise<T> {
    try {
      let result: T | undefined;
      await this.connection.transaction(async (session) => {
        this.storeSession(session);
        result = await fn();
      }, {});
      return result;
    } finally {
      this.storeSession(undefined);
    }
  }
}
