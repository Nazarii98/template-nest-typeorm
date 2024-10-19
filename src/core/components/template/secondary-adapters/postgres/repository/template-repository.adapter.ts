import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Template } from '../../../application/data/template';
import { TemplateRepository, FindTemplateParams } from '../../../ports/template-repository.port';
import { TemplateConverter } from '../converter/template.converter';
import { TemplateEntity } from '../data/template.entity';

export class TemplateRepositoryAdapter implements TemplateRepository {
  private readonly converter = new TemplateConverter();

  constructor(
    @InjectRepository(TemplateEntity)
    private readonly templateRepository: Repository<TemplateEntity>,
  ) {}

  public async save(data: Partial<Template>): Promise<Template> {
    const saved = await this.templateRepository.save(data);

    const templateEntity = await this.templateRepository.findOne({ where: { id: saved.id } });

    return templateEntity ? this.converter.to(templateEntity) : null;
  }

  public async insert(data: Partial<Template>[]): Promise<void> {
    await this.templateRepository.insert(data);
  }

  public async update(criteria: FindOptionsWhere<Template>, data: Partial<Template>): Promise<Template> {
    const existing = await this.findOne(criteria);

    if (!existing) {
      throw new NotFoundException('No such memory file');
    }

    await this.templateRepository.update(existing.id, data);

    const templateEntity = await this.templateRepository.findOne({ where: { id: existing.id } });

    return templateEntity ? this.converter.to(templateEntity) : null;
  }

  public async find(params?: FindTemplateParams): Promise<[Template[], number]> {
    const paginationParams = {
      take: params.size || 10,
      skip: params.page * params.size || 0,
    };

    const [templateItems, count] = await this.templateRepository.findAndCount({
      skip: paginationParams.skip,
      take: paginationParams.take,
    });

    return [templateItems.map(this.converter.to), count];
  }

  public async findBy(data: FindOptionsWhere<Template>): Promise<Template[]> {
    const templateEntity = await this.templateRepository.findBy(data);

    return templateEntity.length ? templateEntity.map(this.converter.to) : null;
  }

  public async findOne(data: FindOptionsWhere<Template>): Promise<Template> {
    const templateEntity = await this.templateRepository.findOne({
      where: data,
    });

    return templateEntity ? this.converter.to(templateEntity) : null;
  }

  public async delete(data: FindOptionsWhere<Template>): Promise<void> {
    await this.templateRepository.delete({ id: data.id });
  }
}
