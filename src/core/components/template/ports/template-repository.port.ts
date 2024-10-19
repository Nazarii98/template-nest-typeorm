import { Template } from '../application/data/template';
import { FindOptionsWhere } from 'typeorm';

export interface FindTemplateParams {
  page?: number;
  size?: number;
}

export interface TemplateRepository {
  save(data: Partial<Template>): Promise<Template>;

  insert(data: Partial<Template>[]): Promise<void>;

  update(criteria: FindOptionsWhere<Template>, data: Partial<Template>): Promise<Template>;

  find(params?: FindTemplateParams): Promise<[Template[], number]>;

  findBy(data: FindOptionsWhere<Template>): Promise<Template[]>;

  findOne(data: FindOptionsWhere<Template>): Promise<Template>;

  delete(data: FindOptionsWhere<Template>): Promise<void>;
}

export const TemplateRepositoryType = Symbol.for('TemplateRepositoryType');
